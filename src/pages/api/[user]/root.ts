import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from '../lib/data/models/_loci'
import { BadRequest } from '../lib/exceptions/BadRequest'
import { InternalServerError } from '../lib/exceptions/InternalServerError'
import { MethodNotAllowed } from '../lib/exceptions/MethodNotAllowed'
import { NotFound } from '../lib/exceptions/NotFound'
import { Data, withData } from '../lib/util/wrappers/_data'
import { withErrorHandler } from '../lib/util/wrappers/_handler'
import { hasAuthority, withAuth } from '../lib/util/wrappers/_tokenValidation'

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
        path: `${encodeURIComponent(user as string)}/${encodeURIComponent(i as string)}`,
      }
    }),
  })
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, data: Data) {
  const { user } = req.query as { user: string }
  withAuth(req, res, [user], async () => {
    const { name } = req.body
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
    return res.status(200).end()
  })
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandler(res, () => {
    withData(async (data) => {
      if (req.method?.toUpperCase() == 'GET') {
        return handleGet(req, res, data)
      } else if (req.method?.toUpperCase() == 'POST') {
        return handlePost(req, res, data)
      } else {
        throw new MethodNotAllowed(`'${req.method}' not allowed`)
      }
    })
  })
}
