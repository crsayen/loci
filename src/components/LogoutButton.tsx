import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BASE_URI } from '@/constants'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      onClick={() =>
        logout({ returnTo: process.env.REACT_ENV_REDIRECT ?? BASE_URI })
      }
    >
      Log Out
    </button>
  )
}

export default LogoutButton
