import NavList, { NavListItem } from '@/components/NavList'
import { BASE_URI } from '@/constants'
import { getData } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { UserListData } from './api/users'

export default function UsersPage() {
  console.log('users.tsx')
  const { getIdTokenClaims } = useAuth0()

  async function fetchItems(): Promise<Array<NavListItem>> {
    const itemData = await getData<UserListData>(
      `${BASE_URI}/api/users`,
      getIdTokenClaims
    )
    return itemData.users.map((i) => {
      const path = `${BASE_URI}/${encodeURIComponent(i)}/root`
      console.log('user path:', path)
      return {
        text: i,
        path,
      }
    })
  }

  return (
    <div>
      <NavList fetcher={fetchItems} />
    </div>
  )
}
