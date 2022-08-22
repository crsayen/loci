import Navbar from '@/components/header/Navbar'
import { BASE_URI } from '@/constants'
import { getIdBearerToken } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import Head from 'next/head'
import { ReactNode, useEffect, useState } from 'react'
import Loading from './Loading'
import NickName from './NickName'

export const USER_REGISTRATION_URL = `${BASE_URI}/api/register`

type Props = {
  children: ReactNode
}

export default function Layout(props: Props) {
  const { isAuthenticated, getIdTokenClaims, isLoading } = useAuth0()
  const [userRegistered, setUserRegistered] = useState<boolean | null>(false)
  const [showLoading, setShowLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!isAuthenticated) return
    setUserRegistered(null)
    getIdBearerToken(getIdTokenClaims).then((token) => {
      console.log({ token })
      axios
        .get(USER_REGISTRATION_URL, { headers: { authorization: token } })
        .then(() => setUserRegistered(true))
        .catch((error) => {
          const { response } = error as { response: { status: number } }
          if (response.status == 404) {
            setUserRegistered(false)
          } else {
            console.error('something is broken')
          }
        })
    })
  }, [isAuthenticated])

  useEffect(() => {
    console.log({ isLoading, userRegistered })
    console.log('we should show loading:', isLoading || userRegistered == null)
    setShowLoading(isLoading || userRegistered == null)
  }, [isLoading, userRegistered])

  return (
    <div className="flex-col w-full h-screen bg-black">
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="pt-2 px-5 layout-content w-full">
        <Loading loading={showLoading} />
        {isAuthenticated ? (
          <>
            {userRegistered ? (
              props.children
            ) : (
              <NickName setUserRegistered={setUserRegistered} />
            )}
          </>
        ) : (
          <>log in to do stuff</>
        )}
      </div>
    </div>
  )
}
