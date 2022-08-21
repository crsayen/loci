import Layout from '@/components/layout'
import NavList, { NavListItem } from '@/components/NavList'
import { BASE_URI } from '@/constants'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { LociListData } from '../api/[user]/root'

export default function LociPage() {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()

  console.log('router query', router.query)

  const { user } = router.query as {
    user: string
  }

  console.log('at:', router.asPath)

  const userPath = `${[user].map(encodeURIComponent).join('/')}`

  async function fetchItems(): Promise<Array<NavListItem>> {
    const itemData = await getData<LociListData>(
      `${BASE_URI}/api/${userPath}/root`,
      getIdTokenClaims
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
