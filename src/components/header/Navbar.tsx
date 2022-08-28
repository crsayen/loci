import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

export default function Navbar() {
  const { isAuthenticated, user } = useAuth0()

  return (
    <div className="header flex flex-row-reverse justify-between items-center px-2">
      <div> {isAuthenticated ? <LogoutButton /> : <LoginButton />} </div>
      {isAuthenticated && <div className="h-min text-xs">{user?.name}</div>}
    </div>
  )
}
