import Link from 'next/link'

export interface NavListItem {
  text: string
  path: string
}

interface Props {
  items: Array<NavListItem>
}

const NavListItem = (item: NavListItem) => (
  <div key={item.path}>
    <Link href={`${item.path}`}>
      <div className="pl-4 py-2 w-full cursor-pointer hover:bg-neutral-900">
        {item.text}
      </div>
    </Link>
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-neutral-800" />
      </div>
    </div>
  </div>
)

export default function NavList(props: Props) {
  console.log(props.items)
  return <div>{props.items.map(NavListItem)}</div>
}
