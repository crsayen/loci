import type { AppProps } from 'next/app'
import { Auth0Provider } from '@auth0/auth0-react'
import '@/styles/globals.css'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <Auth0Provider
      domain="dev--lswpx10.us.auth0.com"
      clientId="BN5pErkRY33nEIqmFymzv2J3acmi6yZv"
      redirectUri={router.basePath}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  )
}
