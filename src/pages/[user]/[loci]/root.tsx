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

export default function ItemsPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('router query', router.query)

  const { user, loci } = router.query as {
    user: string
    loci: string
  }

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
      return {
        text: i.name,
        path: `${i.path}`,
      }
    })
  }

  return (
    <div>
      <NavList fetcher={fetchItems} uri={`${BASE_URI}/`} />
    </div>
  )
}
