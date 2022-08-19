import type { NextApiRequest, NextApiResponse } from 'next'
import { hasAuthority } from './lib/_tokenValidation'
import { withData } from './lib/data/_data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  withData(async (data) => {
    if (!(await hasAuthority(req, 'read:loci'))) return res.status(403).end()
    // const docs = await lociModel.find({}, { name: 1 }).orFail()
    res.status(200).json(
      ['empty', 'boi']
      // docs.map((d) => {
      //   const { name } = d
      //   return name
      // })
    )
  })
}
