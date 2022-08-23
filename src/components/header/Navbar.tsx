import { useAuth0 } from '@auth0/auth0-react'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

const hoverColor = 'white'

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth0()

  const navigation = [
    { name: 'HOME', href: '/', current: router.pathname == '/' },
  ]

  return (
    <div className="header red">
      {isAuthenticated ? (
        <>
          <div className="h-min mx-auto text-xs">{user?.name}</div>
          <div className="absolute right-0">
            <LogoutButton />
          </div>
        </>
      ) : (
        <LoginButton />
      )}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
    </div>
  )
}
