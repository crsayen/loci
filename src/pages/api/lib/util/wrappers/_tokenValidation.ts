import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { NextApiRequest, NextApiResponse } from 'next'

import { Forbidden } from '../../exceptions/Forbidden'
import { Unauthorized } from '../../exceptions/Unauthorized'
import { withData } from './_data'

const client = jwksClient({
  jwksUri: 'https://dev--lswpx10.us.auth0.com/.well-known/jwks.json',
})

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  client.getSigningKey(header.kid, (e, key) => callback(e, key?.getPublicKey()))
}

export async function verify(token: string): Promise<JwtPayload> {
  try {
    return new Promise((res, rej) => {
      jwt.verify(token, getKey, (e, decoded) => {
        if (e != null) return rej(e)
        res(decoded as JwtPayload)
      })
    })
  } catch (e) {
    throw new Unauthorized('Token validation failed', e)
  }
}

export async function hasAuthority(
  token: string,
  authorities: Array<string>
): Promise<void> {
  return withData(async (data) => {
    const { sub } = (await verify(token ?? '')) as unknown as { sub: string }
    const user = await data.users
      .findOne({ id: sub }, { roles: 1 })
      .orFail()
      .catch(() => {
        throw new Forbidden('Unrecognized user')
      })
    const roles = await data.roles.find({ name: { $in: user.roles } })
    const permissions = roles.flatMap((r) => r.permissions)
    if (!authorities.every((a) => permissions.includes(a))) {
      throw new Forbidden('User lacks the required permission(s)')
    }
  })
}

export async function withAuth(
  req: NextApiRequest,
  _: NextApiResponse,
  authorities: Array<string>,
  fn: () => void
) {
  const token = req.headers.authorization?.substring('bearer '.length) ?? ''
  await hasAuthority(token, authorities)
  return fn()
}
