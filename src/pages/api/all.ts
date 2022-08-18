{
  $search: 'text'
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/_model'
import { withData } from './_data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  withData(async (lociModel, _) => {
    const docs = await lociModel.find({}, { name: 1 }).orFail()
    res.status(200).json(
      docs.map((d) => {
        const { name } = d
        return name
      })
    )
  })
}
