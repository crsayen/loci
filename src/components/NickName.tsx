import { get } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { USER_REGISTRATION_URL } from './Layout'
import Button from './primitive/Button'

export default function NickName(props: { setUserRegistered: (v: boolean) => void }) {
  const { getIdTokenClaims } = useAuth0()
  const [nickname, setNickname] = useState<string>('')
  const [isInvalid, setIsInvalid] = useState<boolean | null>(null)
  const [showValidationError, setShowValidationError] = useState<boolean>(false)

  const validate = (n: string): boolean => {
    const regex = new RegExp('^[a-zA-z0-9]{1,20}$')
    return regex.test(n)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = e.target.value
    setNickname(n)
    const valid = validate(n)
    setIsInvalid(!valid)
  }

  const handleSubmit = async () => {
    try {
      await get(USER_REGISTRATION_URL, getIdTokenClaims, { nickname })
      props.setUserRegistered(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => setShowValidationError(isInvalid ?? false), [isInvalid])

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-neutral-900 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium">Account Nickname</h3>
          <div className="mt-2 max-w-xl text-sm">
            <p>Please provide a nickname for your account.</p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="email" className="sr-only">
                Nickname
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="text"
                  id="text"
                  onChange={handleInputChange}
                  className="text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="yourNickname"
                  aria-invalid={!!isInvalid}
                  aria-describedby="invalid-nickname"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {showValidationError && <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}
                </div>
              </div>
              <p className="mt-2 h-3 text-sm text-red-600" id="invalid-nickname">
                {showValidationError ? '1-20 Letters and numbers only.' : ''}
              </p>
            </div>

            <div className="mt-3 mb-4">
              <Button onClick={handleSubmit} disabled={!!isInvalid}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
