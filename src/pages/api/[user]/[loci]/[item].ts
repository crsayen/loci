import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from '../../lib/data/models/_loci'
import { NotFound } from '../../lib/exceptions/NotFound'
import { withData } from '../../lib/util/wrappers/_data'
import { withErrorHandler } from '../../lib/util/wrappers/_handler'
import { hasAuthority } from '../../lib/util/wrappers/_tokenValidation'

export interface ItemData {
  name: any
  loci: any
  owner: any
  description: any
  locations: Array<{ locus: any; count: any }>
}

export default function handleItem(
  req: NextApiRequest,
  res: NextApiResponse<ItemData>
) {
  return withErrorHandler(res, () => {
    withData(async (data) => {
      const { user, loci, item } = req.query
      console.log({ user, loci, item })
      const lociDoc = await data.loci.findOne({ owner: user, loci }).exec()
      if (lociDoc == null)
        throw new NotFound(`Loci '${loci}' not found for user '${user}'`)
      const itemDoc = lociDoc.items.find((i) => i.name == item)
      if (itemDoc == undefined)
        throw new NotFound(`'${item}' not found in '${user}'`)

      res.status(200).json({
        name: item,
        loci,
        owner: user,
        description: itemDoc.description,
        locations: itemDoc.locations.map((l) => {
          return { locus: l.locus, count: l.count }
        }),
      })
    })
  })
}
