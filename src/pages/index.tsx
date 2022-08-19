import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useAuth0 } from '@auth0/auth0-react'
import Explorer from '@/components/Explorer'
import LoginButton from '@/components/LoginButton'
import LogoutButton from '@/components/LogoutButton'
import { BASE_URI } from '@/constants'
import axios from 'axios'

async function loads() {
  await axios.get(`${BASE_URI}/api/load`)
}

export default function Home() {
  const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0()

  if (isLoading) {
    console.log('loading...')
    return <div>Loading ...</div>
  }

  console.log('loaded')
  console.log({ isAuthenticated })
  getIdTokenClaims().then((c) => console.log({ c }))
  return (
    <div className={styles.container}>
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => loads()}>load stuff</button>
      {isAuthenticated && (
        <div>
          <div>
            <img src={user?.picture} alt={user?.name} />
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
          <LogoutButton />
          <Explorer />
        </div>
      )}
      {!isAuthenticated && <LoginButton />}
    </div>
  )
}
