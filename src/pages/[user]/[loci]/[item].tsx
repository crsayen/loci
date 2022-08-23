import ItemView from '@/components/ItemView'
import Layout from '@/components/Layout'
import { useLoading } from '@/components/LoadingContext'
import { BASE_URI } from '@/constants'
import { ItemData } from '@/pages/api/[user]/[loci]/[item]'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ItemPage() {
  const { getIdTokenClaims } = useAuth0()
  const { setLoading } = useLoading()
  const [itemData, setItemData] = useState<ItemData | null>(null)
  const router = useRouter()

  console.log('at:', router.asPath)

  async function fetchItemData(): Promise<ItemData | null> {
    return getData<ItemData>(
      `${BASE_URI}/api/${router.asPath}`,
      getIdTokenClaims
    )
  }

  useEffect(() => {
    setLoading(true)
    fetchItemData().then((item) => {
      setItemData(item)
      setLoading(false)
    })
  }, [])

  return (
    <Layout>
      <ItemView itemData={itemData} />
    </Layout>
  )
}
