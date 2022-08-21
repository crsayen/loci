import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loading from './Loading'

export interface NavListItem {
  text: string
  path: string
}

interface Props {
  fetcher: () => Promise<Array<NavListItem>>
}

export default function NavList(props: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [listItems, setListItems] = useState<Array<NavListItem>>([])

  useEffect(() => {
    console.log('fetching items')
    props.fetcher().then((items) => {
      console.log(items)
      setListItems(items)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="py-5 bg-black text-white w-full">
      <Loading loading={isLoading}></Loading>
      {listItems.map((listItem) => {
        return (
          <div>
            <div
              key={listItem.path}
              className="pl-4 py-2 w-full cursor-pointer hover:bg-neutral-900"
            >
              <Link href={`${listItem.path}`}>{listItem.text}</Link>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-neutral-800" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
