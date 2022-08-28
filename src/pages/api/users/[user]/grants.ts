import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from '../../lib/data/models/_loci'
import { BadRequest } from '../../lib/exceptions/BadRequest'
import { InternalServerError } from '../../lib/exceptions/InternalServerError'
import { MethodNotAllowed } from '../../lib/exceptions/MethodNotAllowed'
import { NotFound } from '../../lib/exceptions/NotFound'
import { Data, withData } from '../../lib/util/wrappers/_data'
import { withErrorHandler } from '../../lib/util/wrappers/_handler'
import { hasAuthority, verify, withAuth } from '../../lib/util/wrappers/_tokenValidation'
import { IUser, User } from '../../lib/data/models/_user'

/*
  /users/:user/grants
  GET -> User Grants
*/

export interface GrantData {
  grants: string
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<User>, data: Data) {
  const { user } = req.query as { user: string }
  await withAuth(
    req,
    res,
    ['read:any.user'],
    async () => {
      const doc = await data.users.findOne({ id: user }).exec()
      if (doc == null) throw new NotFound(`User '${user}' not found`)
      const roles = await data.roles.find({ name: { $in: doc.roles } })
      const grants = [...roles.flatMap((r) => r.permissions), user]
      return { grants }
    },
    { orIsUser: user }
  )
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandler(res, () =>
    withData(async (data) => {
      if (req.method?.toUpperCase() == 'GET') {
        return handleGet(req, res, data)
      } else {
        throw new MethodNotAllowed(`'${req.method}' not allowed`)
      }
    })
  )
}
