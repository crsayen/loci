import AddItemModal from '@/components/AddItemModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import Layout from '@/components/Layout'
import { useLoading } from '@/components/LoadingContext'
import NavList, { NavListItem } from '@/components/NavList'
import Search from '@/components/Search'
import { BASE_URI } from '@/constants'
import { LociRootData } from '@/pages/api/[user]/[loci]/root'
import { getData, httpDelete } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ItemsPage() {
  const { getIdTokenClaims, user, isAuthenticated } = useAuth0()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<string>('')
  const [handleConfirm, setHandleConfirm] = useState<(result: boolean) => void>((_) => {
    console.log('still using old func')
  })
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const router = useRouter()
  const { setLoading } = useLoading()
  const [listItems, setListItems] = useState<Array<NavListItem>>([])

  async function fetchItems(): Promise<Array<NavListItem> | null> {
    const path = `${[router.query.user, router.query.loci]
      //@ts-ignore
      .map(encodeURIComponent)
      .join('/')}`
    const itemData = await getData<LociRootData>(`${BASE_URI}/api/${path}/root`, getIdTokenClaims)
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

  const handleDeleteItem = async (item: string) => {
    const onConfirmation = async (confirmed: boolean) => {
      if (confirmed) {
        setLoading(true)
        const path = `${[router.query.user, router.query.loci, item]
          //@ts-ignore
          .map(encodeURIComponent)
          .join('/')}`
        await httpDelete(`${BASE_URI}/api/${path}`, getIdTokenClaims)
        loadItems()
      } else {
        console.log('nevermind')
      }
      setHandleConfirm((x: boolean) => {})
      setConfirmDeleteOpen(false)
    }
    setItemToDelete(item)
    setHandleConfirm(() => onConfirmation)
    setConfirmDeleteOpen(true)
  }

  const loadItems = () => {
    setLoading(true)
    fetchItems().then((items) => {
      setListItems(items ?? [])
      setLoading(false)
    })
  }

  useEffect(() => {
    setCanEdit(user?.sub == router.query.user)
  }, [isAuthenticated, user])

  useEffect(() => {
    loadItems()
  }, [isAuthenticated])

  return (
    <Layout>
      <ConfirmationModal open={confirmDeleteOpen} onClose={handleConfirm} message={`Delete "${itemToDelete}"?`} />
      <AddItemModal open={addItemModalOpen} onClose={() => setAddItemModalOpen(false)} />
      <div className="-mt-1 absolute mx-auto py-2 z-10 flex flex-row items-end gap-5 justify-start bg-black w-full pr-auto">
        <div className="flex flex-row justify-start items-center gap-4">
          {listItems.length > 10 && (
            <div className="w-60">
              <Search items={listItems.map((i) => i.text)} onSelect={handleSelect} />
            </div>
          )}
          {canEdit && (
            <div>
              <button
                type="button"
                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-white hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-500"
                onClick={() => setAddItemModalOpen(true)}
              >
                <PlusIcon className="h-3 w-3" stroke="#000000" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-20">
        <NavList items={listItems} onDelete={canEdit ? handleDeleteItem : undefined} />
      </div>
    </Layout>
  )
}
