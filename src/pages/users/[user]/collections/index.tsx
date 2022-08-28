import AddLociModal from '@/components/AddLociModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import Layout from '@/components/Layout'
import { useLoading } from '@/components/LoadingContext'
import NavList, { NavListItem } from '@/components/NavList'
import Search from '@/components/Search'
import { BASE_URI } from '@/constants'
import { getData, httpDelete } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LociListData } from '../../../api/users/[user]/collections'

export default function CollectionsPage() {
  const { isAuthenticated, getIdTokenClaims, user } = useAuth0()
  const router = useRouter()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [addLociModalOpen, setAddLociModalOpen] = useState<boolean>(false)
  const [listItems, setListItems] = useState<Array<NavListItem>>([])
  const [lociToDelete, setLociToDelete] = useState<string>('')
  const { setLoading } = useLoading()
  const [handleConfirm, setHandleConfirm] = useState<(result: boolean) => void>((_) => {
    console.log('still using old func')
  })

  const collectionsPath = ['users', router.query.user as string, 'collections'].map(encodeURIComponent).join('/')

  async function fetchItems(): Promise<Array<NavListItem> | null> {
    const itemData = await getData<LociListData>(`${BASE_URI}/api/${collectionsPath}`, getIdTokenClaims)
    if (!itemData) return null
    return itemData.loci.map((i) => {
      const path = `${BASE_URI}${i.path}`
      return {
        text: i.name,
        path,
      }
    })
  }

  const handleSelect = (item: string) => {
    const listItem = listItems.filter((i) => i.text == item)[0]
    router.push(listItem.path)
  }

  const loadItems = () => {
    setLoading(true)
    fetchItems().then((items) => {
      setListItems(items ?? [])
      setLoading(false)
    })
  }

  const handleDeleteItem = async (item: string) => {
    const onConfirmation = async (confirmed: boolean) => {
      if (confirmed) {
        setLoading(true)
        await httpDelete(`${BASE_URI}/api/${collectionsPath}/${encodeURIComponent(item)}`, getIdTokenClaims)
        loadItems()
      } else {
        console.log('nevermind')
      }
      setHandleConfirm((_: boolean) => {})
      setConfirmDeleteOpen(false)
    }
    setLociToDelete(item)
    setHandleConfirm(() => onConfirmation)
    setConfirmDeleteOpen(true)
  }

  useEffect(() => {
    setCanEdit(user?.sub == router.query.user)
  }, [isAuthenticated, user])

  useEffect(() => {
    loadItems()
  }, [isAuthenticated])

  return (
    <Layout>
      <ConfirmationModal open={confirmDeleteOpen} onClose={handleConfirm} message={`Delete "${lociToDelete}"?`} />
      <AddLociModal open={addLociModalOpen} onClose={() => setAddLociModalOpen(false)} />
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
                onClick={() => setAddLociModalOpen(true)}
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
