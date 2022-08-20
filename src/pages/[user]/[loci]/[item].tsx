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
import Layout from '@/components/layout'

export default function ItemPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('at:', router.asPath)

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
    return getData<ItemData>(`${BASE_URI}/api/${router.asPath}`)
  }

  return (
    <Layout>
      <ItemView fetcher={fetchItemData} />
    </Layout>
  )
}
