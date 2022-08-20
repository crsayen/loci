import axios from 'axios'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { BASE_URI } from '@/constants'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { NavListItem } from '@/components/Explorer'
import NavList from '@/components/NavList'
import ItemView from '@/components/ItemView'
import { LociRootData } from '@/pages/api/[user]/[loci]/root'
import { LociListData } from '../api/[user]/root'
import Layout from '@/components/layout'

export default function LociPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('router query', router.query)

  const { user } = router.query as {
    user: string
  }

  console.log('at:', router.asPath)

  const userPath = `${[user].map(encodeURIComponent).join('/')}`

  async function getData<T>(url: string): Promise<T> {
    const claims = await getIdTokenClaims()
    const token = claims?.__raw
    console.log('url', url)
    const result = await axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    })
    return result.data as T
  }

  async function fetchItems(): Promise<Array<NavListItem>> {
    const itemData = await getData<LociListData>(
      `${BASE_URI}/api/${userPath}/root`
    )
    return itemData.loci.map((i) => {
      const { user } = router.query as { user: string }
      const path = `${BASE_URI}/${[user, i.name]
        .map(encodeURIComponent)
        .join('/')}/root`
      console.log('loci path:', path)
      return {
        text: i.name,
        path,
      }
    })
  }

  return (
    <Layout>
      <NavList fetcher={fetchItems} />
    </Layout>
  )
}
