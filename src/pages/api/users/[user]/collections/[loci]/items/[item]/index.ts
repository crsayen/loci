import type { NextApiRequest, NextApiResponse } from 'next'
import { MethodNotAllowed } from '../../../../../../lib/exceptions/MethodNotAllowed'
import { NotFound } from '../../../../../../lib/exceptions/NotFound'
import { Data, withData } from '../../../../../../lib/util/wrappers/_data'
import { withErrorHandler } from '../../../../../../lib/util/wrappers/_handler'
import { withAuth } from '../../../../../../lib/util/wrappers/_tokenValidation'

/*
  /users/:user/collections/:loci/items/:item
  GET -> names-of and paths-to all items in the collection
  POST<{Array<Item>}> adds the given items to the collection -> 200
*/

export interface ItemData {
  name: any
  loci: any
  owner: any
  description: any
  locations: Array<{ locus: any; count: any }>
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<ItemData>, data: Data) {
  const { user, loci, item } = req.query
  const lociDoc = await data.loci.findOne({ owner: user, loci }).exec()
  if (lociDoc == null) throw new NotFound(`Loci '${loci}' not found for user '${user}'`)
  const itemDoc = lociDoc.items.find((i) => i.name == item)
  if (itemDoc == undefined) throw new NotFound(`'${item}' not found in '${user}'`)

  res.status(200).json({
    name: item,
    loci,
    owner: user,
    description: itemDoc.description,
    locations: itemDoc.locations.map((l) => {
      return { locus: l.locus, count: l.count }
    }),
  })
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<ItemData>, data: Data) {
  const { user, loci, item } = req.query as { [k: string]: string }
  await withAuth(
    req,
    res,
    ['write:any.collection'],
    async () => {
      const lociDoc = await data.loci.findOne({ owner: user, loci }).exec()
      if (lociDoc == null) throw new NotFound(`Loci '${loci}' not found for user '${user}'`)
      const itemDoc = lociDoc.items.filter((i) => i.name != item)
      if (itemDoc.length == lociDoc.items.length) throw new NotFound(`'${item}' not found in '${user}'`)
      lociDoc.items = itemDoc
      await lociDoc.save()
      return res.status(204).end()
    },
    { orIsUser: user }
  )
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandler(res, () => {
    withData(async (data) => {
      if (req.method?.toUpperCase() == 'GET') {
        return handleGet(req, res, data)
      } else if (req.method?.toUpperCase() == 'DELETE') {
        return handleDelete(req, res, data)
      } else {
        throw new MethodNotAllowed(`'${req.method}' not allowed`)
      }
    })
  })
}
