import Layout from '@/components/Layout'
import { useLoading } from '@/components/LoadingContext'
import NavList, { NavListItem } from '@/components/NavList'
import { BASE_URI } from '@/constants'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LociListData } from '../api/[user]/root'

export default function LociPage() {
  const [listItems, setListItems] = useState<Array<NavListItem>>([])
  const { getIdTokenClaims } = useAuth0()
  const { setLoading } = useLoading()
  const router = useRouter()

  const { user } = router.query as {
    user: string
  }

  const userPath = `${[user].map(encodeURIComponent).join('/')}`

  async function fetchItems(): Promise<Array<NavListItem> | null> {
    const itemData = await getData<LociListData>(
      `${BASE_URI}/api/${userPath}/root`,
      getIdTokenClaims
    )
    if (!itemData) return null
    return itemData.loci.map((i) => {
      const { user } = router.query as { user: string }
      const path = `${BASE_URI}/${[user, i.name]
        .map(encodeURIComponent)
        .join('/')}/root`
      return {
        text: i.name,
        path,
      }
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchItems().then((items) => {
      setListItems(items ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <Layout>
      <NavList items={listItems} />
    </Layout>
  )
}
