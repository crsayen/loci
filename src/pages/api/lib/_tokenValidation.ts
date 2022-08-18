import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { NextApiRequest } from 'next'

const client = jwksClient({
  jwksUri: 'https://dev--lswpx10.us.auth0.com/.well-known/jwks.json',
})

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) =>
    callback(null, key?.getPublicKey())
  )
}

export async function verify(token: string): Promise<JwtPayload> {
  return new Promise((res, rej) => {
    console.log('verifying token', token)
    jwt.verify(token, getKey, (_, decoded) => {
      console.log({ decoded })
      res(decoded as JwtPayload)
    })
  })
}

export async function hasAuthority(
  req: NextApiRequest,
  ...authorities: string[]
) {
  console.log('before verify')
  try {
    const decoded: { scope: string } = (await verify(
      req.headers.authorization?.substring('bearer '.length) ?? ''
    )) as unknown as { scope: string }
    const scope = decoded.scope.split(' ')
    return authorities.every((a) => scope.includes(a))
  } catch {
    return false
  }
}
