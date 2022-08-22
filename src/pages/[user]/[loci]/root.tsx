import AddItemModal from '@/components/AddItemModal'
import Button from '@/components/Button'
import Layout from '@/components/layout'
import NavList, { NavListItem } from '@/components/NavList'
import { BASE_URI } from '@/constants'
import { LociRootData } from '@/pages/api/[user]/[loci]/root'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ItemsPage() {
  const { getIdTokenClaims, user, isAuthenticated } = useAuth0()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false)
  const router = useRouter()

  console.log('router query:', router.query)
  console.log('user', user)

  async function fetchItems(): Promise<Array<NavListItem>> {
    const path = `${[router.query.user, router.query.loci]
      //@ts-ignore
      .map(encodeURIComponent)
      .join('/')}`
    const itemData = await getData<LociRootData>(
      `${BASE_URI}/api/${path}/root`,
      getIdTokenClaims
    )
    return itemData.items.map((i) => {
      return {
        text: i.name,
        path: `${BASE_URI}/${path}/${encodeURIComponent(i.name)}`,
      }
    })
  }

  useEffect(() => {
    setCanEdit(user?.sub == router.query.user)
  }, [isAuthenticated, user])

  return (
    <Layout>
      <AddItemModal
        open={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
      />
      {canEdit && (
        <div>
          <Button onClick={() => setAddItemModalOpen(true)}>+</Button>
        </div>
      )}
      <NavList fetcher={fetchItems} />
    </Layout>
  )
}
