import Link from 'next/link'
import { useEffect, useState } from 'react'

export interface NavListItem {
  text: string
  path: string
}

interface Props {
  fetcher: () => Promise<Array<NavListItem>>
  uri: string
}

export default function NavList(props: Props) {
  const [listItems, setListItems] = useState<Array<NavListItem>>([])

  useEffect(() => {
    console.log('fetching items')
    props.fetcher().then((items) => {
      console.log(items)
      setListItems
    })
  }, [])

  return (
    <div>
      {listItems.map((listItem) => {
        return (
          <div key={listItem.path}>
            <Link href={`/${listItem.path}`}>{listItem.text}</Link>
          </div>
        )
      })}
    </div>
  )
}
