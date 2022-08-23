import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BASE_URI } from '@/constants'
import Button from '../primitive/Button'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return <Button onClick={() => logout({ returnTo: BASE_URI })}>Log Out</Button>
}

export default LogoutButton
