import type { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from './lib/util/wrappers/_tokenValidation'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  withAuth(req, res, [], () => {
    res.status(200).json([])
  })
  // withData(async (data) => {
  //   if (!(await hasAuthority(req, 'read:loci'))) return res.status(403).end()
  //   // const docs = await lociModel.find({}, { name: 1 }).orFail()
  //   res.status(200).json(
  //     ['empty', 'boi']
  //     // docs.map((d) => {
  //     //   const { name } = d
  //     //   return name
  //     // })
  //   )
  // })
}
