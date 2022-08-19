import axios from 'axios'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Loci } from '../pages/api/lib/data/models/_loci'
import { BASE_URI } from '@/constants'
import { useAuth0 } from '@auth0/auth0-react'

export default function Explorer() {
  const { getIdTokenClaims } = useAuth0()
  const [path, setPath] = useState<string>('')
  const [keys, setKeys] = useState<Array<string>>([])

  async function loads() {
    const claims = await getIdTokenClaims()
    const token = claims?.__raw
    const result = await axios.get(`${BASE_URI}${path}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    console.log(result.data)
    return result.data
  }

  return (
    <div className={styles.main}>
      <input onChange={(e) => setPath(e.target.value)}></input>
      <button onClick={() => loads()}>this will run the code</button>
    </div>
  )
}
