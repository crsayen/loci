// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/model'
import { withData } from './data'
import lociList from './lociList'
import logger from './lib/logger'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Loci>
) {
  withData(async (lociModel, _) => {
    for (const l of lociList) {
      logger.info(`saving ${l.name}`)
      await lociModel.create(l)
    }
    res.status(200)
  })
}
