import axios from 'axios'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Loci } from '../pages/api/lib/data/models/_loci'
import { BASE_URI } from '@/constants'
import { useAuth0 } from '@auth0/auth0-react'

export default function Explorer() {
  const { getAccessTokenSilently } = useAuth0()
  const [keys, setKeys] = useState<Array<string>>([])

  async function loads() {
    const token = await getAccessTokenSilently({
      audience: `${BASE_URI}/api`,
      scope: 'read:loci',
    })
    const result = await axios.get(`${BASE_URI}/api/all`, {
      headers: { authorization: `Bearer ${token}` },
    })
    console.log(result.data)
    return result.data
  }

  async function getPage(page: string): Promise<Loci> {
    const token = await getAccessTokenSilently({
      audience: `${BASE_URI}/api`,
      scope: 'read:loci read:locus',
    })
    console.log({ token })
    const result = await axios.get(
      `${BASE_URI}/api/${encodeURIComponent(page)}`,
      { headers: { authorization: `Bearer ${token}` } }
    )
    console.log(result)
    return result.data
  }

  async function alertStuffs(key: string) {
    // try {
    //   const { name, loci, description } = await getPage(key)
    //   const location = loci.map((l) => {
    //     const { locus, count } = l
    //     return { locus, count }
    //   })
    //   alert(
    //     `${name}\ndescription: ${description}\nlocation: ${JSON.stringify(
    //       location,
    //       null,
    //       2
    //     )}`
    //   )
    // } catch (e) {
    //   console.log(e)
    //   alert("you do not have permission to view the item's location")
    // }
  }

  useEffect(() => {
    loads().then(setKeys)
  }, [])

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
