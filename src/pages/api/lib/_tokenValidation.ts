import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const client = jwksClient({
  jwksUri: 'https://dev--lswpx10.us.auth0.com/.well-known/jwks.json',
})

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) =>
    callback(null, key?.getPublicKey())
  )
}

export async function verify(token: string) {
  return new Promise((res, rej) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: 'https://hazel-jade.vercel.app/api',
        issuer: 'https://dev--lswpx10.us.auth0.com/',
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        console.log(decoded)
        res(!!err)
      }
    )
  })
}
