import AddItemModal from '@/components/AddItemModal'
import Layout from '@/components/Layout'
import { useLoading } from '@/components/LoadingContext'
import NavList, { NavListItem } from '@/components/NavList'
import Button from '@/components/primitive/Button'
import Search from '@/components/Search'
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
  const { setLoading } = useLoading()
  const [listItems, setListItems] = useState<Array<NavListItem>>([])

  console.log('router query:', router.query)
  console.log('user', user)

  async function fetchItems(): Promise<Array<NavListItem> | null> {
    const path = `${[router.query.user, router.query.loci]
      //@ts-ignore
      .map(encodeURIComponent)
      .join('/')}`
    const itemData = await getData<LociRootData>(
      `${BASE_URI}/api/${path}/root`,
      getIdTokenClaims
    )
    if (!itemData) return null
    return itemData.items.map((i) => {
      return {
        text: i.name,
        path: `${BASE_URI}/${path}/${encodeURIComponent(i.name)}`,
      }
    })
  }

  const handleSelect = (item: string) => {
    const listItem = listItems.filter((i) => i.text == item)[0]
    router.push(listItem.path)
  }

  useEffect(() => {
    setCanEdit(user?.sub == router.query.user)
  }, [isAuthenticated, user])

  useEffect(() => {
    setLoading(true)
    fetchItems().then((items) => {
      setListItems(items ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <Layout>
      <AddItemModal open={true} onClose={() => setAddItemModalOpen(false)} />
      <div className="absolute mx-auto py-2 z-10 flex flex-row items-end gap-5 justify-start bg-black w-full pr-auto">
        <div>
          {canEdit && (
            <Button onClick={() => setAddItemModalOpen(true)}>+</Button>
          )}
        </div>
        <div className="w-">
          {listItems.length > 10 && (
            <Search
              items={listItems.map((i) => i.text)}
              onSelect={handleSelect}
            ></Search>
          )}
        </div>
      </div>
      <NavList items={listItems} />
    </Layout>
  )
}
