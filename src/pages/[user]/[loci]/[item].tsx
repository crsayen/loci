import ItemView from '@/components/ItemView'
import Layout from '@/components/layout'
import { BASE_URI } from '@/constants'
import { ItemData } from '@/pages/api/[user]/[loci]/[item]'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'

export default function ItemPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('at:', router.asPath)

  async function fetchItemData(): Promise<ItemData> {
    return getData<ItemData>(
      `${BASE_URI}/api/${router.asPath}`,
      getIdTokenClaims
    )
  }

  return (
    <Layout>
      <ItemView fetcher={fetchItemData} />
    </Layout>
  )
}
