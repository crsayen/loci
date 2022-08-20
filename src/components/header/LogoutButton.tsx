import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BASE_URI } from '@/constants'
import Button from '../Button'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <Button
      onClick={() =>
        logout({ returnTo: process.env.REACT_ENV_REDIRECT ?? BASE_URI })
      }
      text="Log Out"
    />
  )
}

export default LogoutButton
