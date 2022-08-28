import { BASE_URI } from '@/constants'
import { Item, Locus } from '@/pages/api/lib/data/models/_loci'
import { post } from '@/util'
import { useAuth0 } from '@auth0/auth0-react'
import { Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { ChangeEvent, Fragment, useState } from 'react'
import { inputStyle } from './StyleProviders'

interface AddItemData {
  name: string
  count: number | ''
  description: string
  descriptionOpen: boolean
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function AddItemModal(props: Props) {
  const { getIdTokenClaims } = useAuth0()
  const router = useRouter()
  const [name, setName] = useState<string>('')

  const handleSave = async () => {
    const path = `${['users', router.query.user, 'collections']
      //@ts-ignore
      .map(encodeURIComponent)
      .join('/')}`
    await post<{ name: string }, any>(`${BASE_URI}/api/${path}`, { name }, getIdTokenClaims)
    props.onClose()
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-black rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <label htmlFor="locus" className="block text-sm font-medium text-white">
                    Name your stash
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="locus"
                      id="locus"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                      className={inputStyle()}
                      placeholder="Make a decision!"
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
