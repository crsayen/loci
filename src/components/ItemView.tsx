import { ItemData } from '@/pages/api/[user]/[loci]/[item]'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  fetcher: () => Promise<ItemData>
}

export default function ItemView(props: Props) {
  const [itemData, setItemData] = useState<ItemData>()

  useEffect(() => {
    console.log('fetching itemciew')
    props.fetcher().then(setItemData)
  }, [])

  return (
    <div className="bg-black text-white">
      {itemData && (
        <div>
          <div>ITEM: {itemData.name}</div>
          <div>
            {itemData.locations.map((l, i) => {
              return (
                <div key={i}>
                  <div>LOCUS: {l.locus}</div>
                  <div>COUNT: {l.count}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
