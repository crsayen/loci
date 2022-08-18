import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Loci } from './api/lib/model'

async function getPage(page: string): Promise<Loci> {
  const result = await axios.get(
    `http://localhost:3000/api/${encodeURIComponent(page)}`
  )
  console.log(result)
  return result.data
}

async function loads() {
  const result = await axios.get('http://localhost:3000/api/all')
  console.log(result.data)
  return result.data
}

async function alertStuffs(key: string) {
  const { name, loci, description } = await getPage(key)
  const location = loci.map((l) => {
    const { locus, count } = l
    return { locus, count }
  })
  alert(
    `${name}\ndescription: ${description}\nlocation: ${JSON.stringify(
      location,
      null,
      2
    )}`
  )
}

export default function Home() {
  const [keys, setKeys] = useState<Array<string>>([])

  useEffect(() => {
    loads().then(setKeys)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>TypeScript starter for Next.js</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {keys.map((k) => {
          return (
            <button key={k} onClick={() => alertStuffs(k)}>
              {k}
            </button>
          )
        })}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=typescript-nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{` `}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
