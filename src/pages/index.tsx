import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useAuth0 } from '@auth0/auth0-react'
import Explorer from '@/components/Explorer'
import LoginButton from '@/components/LoginButton'
import LogoutButton from '@/components/LogoutButton'
import { BASE_URI } from '@/constants'
import axios from 'axios'
import Link from 'next/link'

const TEST_USER = 'google-oauth2|103474783628012635639'

export default function Home() {
  const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0()

  async function loads() {
    const claims = await getIdTokenClaims()
    await axios.get(`${BASE_URI}/api/load`, {
      headers: {
        authorization: `Bearer ${claims?.__raw}`,
      },
    })
  }

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isAuthenticated && (
        <div>
          <div>
            <img src={user?.picture} alt={user?.name} />
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
          <LogoutButton />
          <div>
            <Link
              href={`${BASE_URI}/${encodeURIComponent(TEST_USER)}/stache/root`}
            >
              <button>stache</button>
            </Link>
          </div>
        </div>
      )}
      {!isAuthenticated && <LoginButton />}
    </div>
  )
}
