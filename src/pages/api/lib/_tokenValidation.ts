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
      res(decoded as JwtPayload)
    })
  })
}

export async function hasAuthority(
  req: NextApiRequest,
  ...authorities: string[]
) {
  console.log('verifying authority')
  const decoded = await verify(
    req.headers.authorization?.substring('bearer '.length) ?? ''
  )
  console.log({ decoded })
  return true
}
