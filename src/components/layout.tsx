import Navbar from '@/components/header/Navbar'
import { BASE_URI } from '@/constants'
import { get, getIdBearerToken } from '@/util'
import { IdToken, useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import Head from 'next/head'
import { ReactNode, useEffect, useState } from 'react'
import Loading from './Loading'
import { useLoading } from './LoadingContext'
import NickName from './NickName'

type Props = {
  children: ReactNode
}

export default function Layout(props: Props) {
  const { isAuthenticated, getIdTokenClaims, isLoading: authIsLoading } = useAuth0()
  const [userRegistered, setUserRegistered] = useState<boolean | null>(false)
  const { loading, setLoading } = useLoading()

  useEffect(() => {
    setLoading(authIsLoading || userRegistered == null)
  }, [authIsLoading, userRegistered])

  useEffect(() => {
    if (!isAuthenticated) return
    setUserRegistered(null)
    getIdBearerToken(getIdTokenClaims).then(async (token) => {
      const { sub } = (await getIdTokenClaims()) as IdToken
      console.log(`${BASE_URI}/api/users/${encodeURIComponent(sub)}`)
      try {
        await axios.get(`${BASE_URI}/api/users/${encodeURIComponent(sub)}`, { headers: { authorization: token } })
        setUserRegistered(true)
      } catch (error) {
        console.error(error)
        const { response } = error as { response: { status: number } }
        if (response.status == 404) {
          setUserRegistered(false)
        } else {
          console.error('something is broken')
        }
      }
    })
  }, [isAuthenticated])

  return (
    <div className="layout bg-black">
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="px-1 main w-full overflow-y-scroll mx-auto">
        <Loading loading={loading} />
        {isAuthenticated ? (
          <>{userRegistered ?? true ? props.children : <NickName setUserRegistered={setUserRegistered} />}</>
        ) : (
          <div>
            {[
              "Owls don't have eyeballs",
              'A tiger’s roar can be heard up to two miles away',
              'Pineapples take two years to grow',
              'Niagara Falls never freezes',
              'You need to be logged in to do stuff',
            ].map((s, i) => {
              return (
                <div key={i} className="pt-5">
                  {s}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
