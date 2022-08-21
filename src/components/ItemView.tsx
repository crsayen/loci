import { ItemData } from '@/pages/api/[user]/[loci]/[item]'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loading from './Loading'

interface Props {
  fetcher: () => Promise<ItemData>
}

export default function ItemView(props: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [itemData, setItemData] = useState<ItemData>()

  useEffect(() => {
    console.log('fetching itemciew')
    props.fetcher().then((d) => {
      setItemData(d)
      setIsLoading(false)
    })
  }, [])
  console.log(itemData)
  return (
    <div className="bg-black text-white">
      <Loading loading={isLoading}></Loading>
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
