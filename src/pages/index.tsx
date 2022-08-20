import Head from 'next/head'
import { useAuth0 } from '@auth0/auth0-react'
import Explorer from '@/components/Explorer'
import LoginButton from '@/components/header/LoginButton'
import LogoutButton from '@/components/header/LogoutButton'
import { BASE_URI } from '@/constants'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '@/components/header/NavBar'
import UsersPage from './users'
import Layout from '@/components/layout'

const TEST_USER = 'google-oauth2|103474783628012635639'

export default function Home() {
  console.log('index.tsx')
  const { isAuthenticated } = useAuth0()

  return <Layout>{isAuthenticated ? <UsersPage /> : <></>}</Layout>
}
