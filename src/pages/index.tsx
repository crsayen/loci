import Layout from '@/components/layout'
import Loading from '@/components/Loading'
import NickName from '@/components/NickName'
import { BASE_URI } from '@/constants'
import { getIdBearerToken } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import UsersPage from './users'

export const USER_REGISTRATION_URL = `${BASE_URI}/api/register`

export default function Home() {
  console.log('index.tsx')
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
    <Layout>
      <Loading loading={showLoading} />
      <UsersPage />
    </Layout>
  )
}
