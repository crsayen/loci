import Head from 'next/head'
import axios from 'axios'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Loci } from '../pages/api/lib/_model'
import { BASE_URI } from '@/constants'
import { useAuth0 } from '@auth0/auth0-react'

async function getPage(page: string): Promise<Loci> {
  const result = await axios.get(`${BASE_URI}/api/${encodeURIComponent(page)}`)
  console.log(result)
  return result.data
}

async function loads() {
  const result = await axios.get(`${BASE_URI}/api/all`)
  console.log(result.data)
  return result.data
}

async function alertStuffs(key: string) {
  const { name, loci, description } = await getPage(key)
  const location = loci.map((l) => {
    const { locus, count } = l
    return { locus, count }
  })
  alert(
    `${name}\ndescription: ${description}\nlocation: ${JSON.stringify(
      location,
      null,
      2
    )}`
  )
}

export default function Explorer() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [keys, setKeys] = useState<Array<string>>([])

  useEffect(() => {
    loads().then(setKeys)
  }, [])

  useEffect(() => {
    const fetchToken = async () => {
      const domain = 'dev--lswpx10.us.auth0.com'

      try {
        const accessToken = await getAccessTokenSilently({
          audience: `${BASE_URI}/api`,
          scope: 'read:loci',
        })
        console.log({ accessToken })
      } catch (e) {
        console.error(e)
      }
    }

    fetchToken()
  }, [getAccessTokenSilently])

  return (
    <main className={styles.main}>
      {keys.map((k) => {
        return (
          <button key={k} onClick={() => alertStuffs(k)}>
            {k}
          </button>
        )
      })}
    </main>
  )
}
