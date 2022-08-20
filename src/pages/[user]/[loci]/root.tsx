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
import Layout from '@/components/layout'

export default function ItemsPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('router query', router.query)

  const { user, loci } = router.query as {
    user: string
    loci: string
  }

  console.log('at:', router.asPath)

  const lociPath = `${[user, loci].map(encodeURIComponent).join('/')}`

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
    const itemData = await getData<LociRootData>(
      `${BASE_URI}/api/${lociPath}/root`
    )
    return itemData.items.map((i) => {
      const { user, loci } = router.query as { user: string; loci: string }
      const path = `${BASE_URI}/${[user, loci, i.name]
        .map(encodeURIComponent)
        .join('/')}`
      console.log('item path:', path)
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
