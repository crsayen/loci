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
import { LociListData } from './api/[user]/root'
import { UserListData } from './api/users'
import Layout from '@/components/layout'

export default function UsersPage() {
  console.log('users.tsx')
  const { getIdTokenClaims } = useAuth0()

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
    const itemData = await getData<UserListData>(`${BASE_URI}/api/users`)
    return itemData.users.map((i) => {
      const path = `${BASE_URI}/${encodeURIComponent(i)}/root`
      console.log('user path:', path)
      return {
        text: i,
        path,
      }
    })
  }

  return (
    <div>
      <NavList fetcher={fetchItems} />
    </div>
  )
}
