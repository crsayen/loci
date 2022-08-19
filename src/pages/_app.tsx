import type { AppProps } from 'next/app'
import { Auth0Provider } from '@auth0/auth0-react'
import '@/styles/globals.css'
import { BASE_URI } from '@/constants'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain="dev--lswpx10.us.auth0.com"
      clientId="BN5pErkRY33nEIqmFymzv2J3acmi6yZv"
      redirectUri={BASE_URI}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  )
}
