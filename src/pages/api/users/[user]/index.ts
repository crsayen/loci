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
  /users/:user
  GET -> User
  POST<{nickname}> update user nickname -> 200
*/

export interface LociListData {
  owner: string
  loci: Array<{ name: string; path: string }>
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<User>, data: Data) {
  const { user } = req.query as { user: string }
  const doc = await data.users.findOne({ id: user }).exec()
  if (doc == null) throw new NotFound(`User '${user}' not found`)
  if (!doc.nickname) throw new NotFound(`User '${user}' exists but has not registered`)
  return res.status(200).json({
    id: doc.id,
    nickname: doc.nickname,
    loci: doc.loci,
    roles: doc.roles,
  })
}

async function setUserNickname(data: Data, id: string, nickname: string) {
  let doc = await data.users.findOne({ id }, { nickname: 1 }).exec()
  if (!doc) {
    const newUser: User = { id, loci: [], roles: [], nickname }
    return await data.users.create(newUser)
  }
  if (doc.nickname == nickname) return
  doc.nickname = nickname
  await doc.save()
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, data: Data) {
  const { nickname } = req.body as { nickname: string }
  const { user } = req.query as { user: string }

  if (!nickname) throw new BadRequest('missing required field: nickname')

  await withAuth(req, res, ['write:any.user'], () => setUserNickname(data, user, nickname), { orIsUser: user })
  return res.status(200).end()
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
