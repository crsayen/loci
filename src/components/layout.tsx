import Navbar from '@/components/header/Navbar'
import Head from 'next/head'

type Props = {
  children: JSX.Element | Array<JSX.Element>
}

export default function Layout(props: Props) {
  return (
    <div className="flex-col w-screen m-auto h-screen bg-black">
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="px-5 layout-content  w-full overflow-y-scroll">
        {props.children}
      </div>
    </div>
  )
}
