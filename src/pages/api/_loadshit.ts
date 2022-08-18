// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/_model'
import { withData } from './_data'
import lociList from './_lociList'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Loci>
) {
  withData(async (lociModel, _) => {
    for (const l of lociList) {
      console.log(`saving ${l.name}`)
      await lociModel.create(l)
    }
    res.status(200)
  })
}
