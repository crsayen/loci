import axios from 'axios'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { BASE_URI } from '@/constants'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { NavListItem } from '@/components/Explorer'
import NavList from '@/components/NavList'
import ItemView from '@/components/ItemView'
import { ItemData } from '@/pages/api/[user]/[loci]/[item]'

export default function ItemPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('router query', router.query)

  const { user, loci, item } = router.query as {
    user: string
    loci: string
    item: string
  }

  const lociPath = `${[user, loci, item]
    .map((c) => encodeURIComponent(c))
    .join('/')}`

  async function getData<T>(url: string): Promise<T> {
    const claims = await getIdTokenClaims()
    const token = claims?.__raw
    console.log('[item]', url)
    const result = await axios.get(url, {
      headers: { authorization: `Bearer ${token}` },
    })
    return result.data as T
  }

  async function fetchItemData(): Promise<ItemData> {
    return getData<ItemData>(`${BASE_URI}/api/${lociPath}`)
  }

  return (
    <>
      <ItemView fetcher={fetchItemData} />
    </>
  )
}
