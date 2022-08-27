import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

interface Item {
  name: string
  count: number
  description: string
}

type Props = {
  open: boolean
  onClose: () => void
}

const newItem = (): Item => {
  return { name: '', count: 1, description: '' }
}

export default function AddItemModal(props: Props) {
  const [locus, setLocus] = useState<string>('')
  const [items, setItems] = useState<Array<Item>>([newItem()])

  const handleEditLocusName = (name: string) => setLocus(name)
  const handleEditItemName = (i: number, value: string) =>
    handleEditItem(i, 'name', value)
  const handleEditItemDescription = (i: number, description: string) =>
    handleEditItem(i, 'name', description)
  const handleEditItemCount = (i: number, count: string) =>
    handleEditItem(i, 'name', count)
  const handleEditItem = (i: number, property: keyof Item, value: string) => {
    const oldItem = items[i]
    const newItem =
      property == 'count'
        ? { ...oldItem, count: parseInt(value) }
        : property == 'description'
        ? { ...oldItem, description: value }
        : { ...oldItem, name: value }
    setItems([...items.slice(0, i), newItem, ...items.slice(i + 1)])
  }

  const handleAddItem = () => setItems([...items, newItem()])
  const handleDeleteItem = (i: number) =>
    setItems([...items.slice(0, i), ...items.slice(i + 1)])

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                  <label
                    htmlFor="locus"
                    className="block text-sm font-medium text-white"
                  >
                    Locus
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="locus"
                      id="locus"
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleEditLocusName(event.target.value)
                      }
                      className="w-full shadow-sm sm:text-sm rounded-md bg-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 block border-neutral-600"
                      placeholder="Where?"
                    />
                  </div>
                </div>
                <div>
                  {items.map((item, i) => {
                    return (
                      <div key={i}>
                        <div className="flex flex-row gap-3 pt-5">
                          <div>
                            <label
                              htmlFor={`item-${i}`}
                              className="block text-sm font-medium text-white"
                            >
                              Name
                            </label>
                            <div>
                              <input
                                type="text"
                                name={`item-${i}`}
                                id={`item-${i}`}
                                value={item.name}
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>
                                ) => handleEditItemName(i, event.target.value)}
                                className="w-full shadow-sm sm:text-sm rounded-md bg-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 block border-neutral-600"
                                placeholder="What?"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor={`item-count-${i}`}
                              className="block text-sm font-medium text-white"
                            >
                              Count
                            </label>
                            <div>
                              <input
                                type="text"
                                name={`item-count-${i}`}
                                id={`item-count-${i}`}
                                value={item.count}
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>
                                ) => handleEditItemCount(i, event.target.value)}
                                className="w-16 shadow-sm sm:text-sm rounded-md bg-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 block border-neutral-600"
                                placeholder="How many?"
                              />
                            </div>
                          </div>
                          <div className="mt-5 sm:mt-6">
                            <button
                              type="button"
                              className="inline-flex justify-center w-8 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                              onClick={() => handleDeleteItem(i)}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={props.onClose}
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
