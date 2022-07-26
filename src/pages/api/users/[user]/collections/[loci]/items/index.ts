import type { NextApiRequest, NextApiResponse } from 'next'
import { InternalServerError } from '../../../../../lib/exceptions/InternalServerError'
import { MethodNotAllowed } from '../../../../../lib/exceptions/MethodNotAllowed'
import { NotFound } from '../../../../../lib/exceptions/NotFound'
import { Data, withData } from '../../../../../lib/util/wrappers/_data'
import { withErrorHandler } from '../../../../../lib/util/wrappers/_handler'
import { withAuth } from '../../../../../lib/util/wrappers/_tokenValidation'

/*
  /users/:user/collections/:loci/items
  GET -> names-of and paths-to all items in the collection
  POST<{Array<Item>}> adds the given items to the collection -> 200
*/

export interface LociRootData {
  name: string
  owner: string
  items: Array<{ name: string; path: string }>
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<LociRootData>, data: Data) {
  const { user, loci } = req.query as { user: string; loci: string }
  const doc = await data.loci.findOne({ owner: user, loci }).exec()
  if (doc == null) throw new NotFound(`Loci '${loci}' not found for user '${user}'`)
  return res.status(200).json({
    name: loci as string,
    owner: user as string,
    items: doc.items.map((i) => {
      return {
        name: i.name,
        path: ['', 'users', user, 'collections', loci, 'items', i.name].map(encodeURIComponent).join('/'),
      }
    }),
  })
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<void>, data: Data) {
  const { user, loci } = req.query as { user: string; loci: string }
  return withAuth(
    req,
    res,
    ['write:any.collection'],
    async () => {
      const items = req.body
      try {
        const doc = await data.loci.findOne({ owner: user, name: loci }).orFail()
        doc.items.push(...items)
        await doc.save()
      } catch (e) {
        throw new InternalServerError('an error has occured', e)
      }
      return res.status(200).end()
    },
    { orIsUser: user }
  )
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandler(res, () =>
    withData(async (data) => {
      if (req.method?.toUpperCase() == 'GET') {
        return handleGet(req, res, data)
      } else if (req.method?.toUpperCase() == 'POST') {
        return handlePost(req, res, data)
      } else {
        throw new MethodNotAllowed(`'${req.method}' not allowed`)
      }
    })
  )
}
