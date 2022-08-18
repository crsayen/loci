// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/model'
import { withData } from './data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Loci>
) {
  withData(async (lociModel, _) => {
    const { lociName } = req.query
    const { name, description, loci } = await lociModel
      .findOne({ name: lociName })
      .orFail()
    res.status(200).json({ name, description, loci })
  })
}
