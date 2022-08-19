import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from '../../lib/data/models/_loci'
import { NotFound } from '../../lib/exceptions/NotFound'
import { withData } from '../../lib/util/wrappers/_data'
import { withErrorHandler } from '../../lib/util/wrappers/_handler'
import { hasAuthority } from '../../lib/util/wrappers/_tokenValidation'

interface R {
  name: string
  owner: string
  items: Array<{ name: string; path: string }>
}

export default function handler(req: NextApiRequest, res: NextApiResponse<R>) {
  withErrorHandler(res, () => {
    withData(async (data) => {
      const { user, loci } = req.query
      const doc = await data.loci.findOne({ owner: user, loci }).exec()
      if (doc == null)
        throw new NotFound(`Loci '${loci}' not found for user '${user}'`)
      res.status(200).json({
        name: loci,
        owner: user,
        items: doc.items,
      })
    })
  })
}
