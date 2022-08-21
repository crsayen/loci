import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loading from './Loading'
import Search from './Search'

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
  const router = useRouter()

  useEffect(() => {
    console.log('fetching items')
    props.fetcher().then((items) => {
      console.log(items)
      setListItems(items)
      setIsLoading(false)
    })
  }, [])

  const handleSelect = (item: string) => {
    const listItem = listItems.filter((i) => i.text == item)[0]
    router.push(listItem.path)
  }

  return (
    <div>
      <div className="py-5 bg-black text-white w-full">
        <Loading loading={isLoading}></Loading>
        {listItems.length > 10 && (
          <Search
            items={listItems.map((i) => i.text)}
            onSelect={handleSelect}
          ></Search>
        )}
        {listItems.map((listItem) => {
          return (
            <div>
              <Link href={`${listItem.path}`}>
                <div
                  key={listItem.path}
                  className="pl-4 py-2 w-full cursor-pointer hover:bg-neutral-900"
                >
                  {listItem.text}
                </div>
              </Link>
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
    </div>
  )
}
