import type { NextApiRequest, NextApiResponse } from 'next'
import { BadRequest } from '../../../lib/exceptions/BadRequest'
import { InternalServerError } from '../../../lib/exceptions/InternalServerError'
import { MethodNotAllowed } from '../../../lib/exceptions/MethodNotAllowed'
import { NotFound } from '../../../lib/exceptions/NotFound'
import { Data, withData } from '../../../lib/util/wrappers/_data'
import { withErrorHandler } from '../../../lib/util/wrappers/_handler'
import { withAuth } from '../../../lib/util/wrappers/_tokenValidation'

/*
  /users/:user/collections
  GET -> names of all the user's collections
  POST<{name}> create a collection with the given name -> 201
*/

export interface LociListData {
  owner: string
  loci: Array<{ name: string; path: string }>
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<LociListData>, data: Data) {
  const { user } = req.query as { user: string }
  const doc = await data.users.findOne({ id: user }).exec()
  if (doc == null) throw new NotFound(`User '${user}' not found`)
  return res.status(200).json({
    owner: user as string,
    loci: doc.loci.map((i) => {
      return {
        name: i,
        path: ['', 'users', user, 'collections', i, 'items'].map(encodeURIComponent).join('/'),
      }
    }),
  })
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, data: Data) {
  console.log('POST new items to collection')
  const { user } = req.query as { user: string }
  return withAuth(
    req,
    res,
    ['write:any.collection'],
    async () => {
      const { name } = req.body
      console.log('collection:', name)
      try {
        const exists = await data.loci.exists({ owner: user, name }).exec()
        if (exists) {
          throw new BadRequest('the user already has a loci with this name')
        }
        data.loci.create({ name, items: [], owner: user })
        const doc = await data.users.findOne({ id: user }).orFail()
        doc.loci.push(name)
        await doc.save()
      } catch (e) {
        throw new InternalServerError('an error has occured', e)
      }
      return res.status(201).end()
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
