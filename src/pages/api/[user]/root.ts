import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from '../lib/data/models/_loci'
import { NotFound } from '../lib/exceptions/NotFound'
import { withData } from '../lib/util/wrappers/_data'
import { withErrorHandler } from '../lib/util/wrappers/_handler'
import { hasAuthority } from '../lib/util/wrappers/_tokenValidation'

export interface LociListData {
  owner: string
  loci: Array<{ name: string; path: string }>
}

export default function handleRoot(
  req: NextApiRequest,
  res: NextApiResponse<LociListData>
) {
  return withErrorHandler(res, () => {
    return withData(async (data) => {
      const { user } = req.query as { user: string }
      console.log({ user })
      const doc = await data.users.findOne({ id: user }).exec()
      if (doc == null) throw new NotFound(`User '${user}' not found`)
      return res.status(200).json({
        owner: user as string,
        loci: doc.loci.map((i) => {
          return {
            name: i,
            path: `${encodeURIComponent(user as string)}/${encodeURIComponent(
              i as string
            )}`,
          }
        }),
      })
    })
  })
}
