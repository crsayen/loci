import type { NextApiRequest, NextApiResponse } from 'next'
import { hasAuthority } from './lib/util/wrappers/_tokenValidation'
import { withData } from './lib/util/_data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  withData(async (data) => {
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
