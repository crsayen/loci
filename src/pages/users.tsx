import { useLoading } from '@/components/LoadingContext'
import NavList, { NavListItem } from '@/components/NavList'
import { BASE_URI } from '@/constants'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { UserListData } from './api/users'

export default function UsersPage() {
  const [users, setUsers] = useState<Array<NavListItem>>([])
  const { setLoading } = useLoading()
  const { getIdTokenClaims } = useAuth0()

  async function fetchItems(): Promise<Array<NavListItem>> {
    const itemData = await getData<UserListData>(
      `${BASE_URI}/api/users`,
      getIdTokenClaims
    )
    if (!itemData) return []
    return itemData.users.map((i) => {
      const path = `${BASE_URI}/${encodeURIComponent(i.id)}/root`
      return {
        text: i.nickname,
        path,
      }
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchItems().then((items) => {
      setUsers(items)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <NavList items={users} />
    </div>
  )
}
