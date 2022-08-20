import Head from 'next/head'
import { useAuth0 } from '@auth0/auth0-react'
import Explorer from '@/components/Explorer'
import LoginButton from '@/components/header/LoginButton'
import LogoutButton from '@/components/header/LogoutButton'
import { BASE_URI } from '@/constants'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '@/components/header/Navbar'

const TEST_USER = 'google-oauth2|103474783628012635639'

type Props = {
  children: JSX.Element
}

export default function Layout(props: Props) {
  const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0()

  return (
    <div className="flex-col w-screen m-auto bg-black">
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {props.children}
    </div>
  )
}
