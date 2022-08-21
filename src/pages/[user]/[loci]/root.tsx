import Layout from '@/components/layout'
import NavList, { NavListItem } from '@/components/NavList'
import { BASE_URI } from '@/constants'
import { LociRootData } from '@/pages/api/[user]/[loci]/root'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'

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

  async function fetchItems(): Promise<Array<NavListItem>> {
    const itemData = await getData<LociRootData>(
      `${BASE_URI}/api/${lociPath}/root`,
      getIdTokenClaims
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
