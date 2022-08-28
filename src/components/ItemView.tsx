import { ItemData } from '@/pages/api/users/[user]/collections/[loci]/items/[item]'

interface Props {
  itemData: ItemData | null
}

export default function ItemView(props: Props) {
  if (!props.itemData) {
    return <></>
  }

  return (
    <div className="bg-black text-white">
      <div>ITEM: {props.itemData.name}</div>
      <div>
        {props.itemData.locations.map((l, i) => {
          return (
            <div key={i}>
              <div>LOCUS: {l.locus}</div>
              <div>COUNT: {l.count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
