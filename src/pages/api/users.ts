import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/data/models/_loci'
import { NotFound } from './lib/exceptions/NotFound'
import { withData } from './lib/util/wrappers/_data'
import { withErrorHandler } from './lib/util/wrappers/_handler'
import { hasAuthority } from './lib/util/wrappers/_tokenValidation'

export interface UserListData {
  users: Array<{ id: string; nickname: string }>
}

export default function handleRoot(
  req: NextApiRequest,
  res: NextApiResponse<UserListData>
) {
  return withErrorHandler(res, () => {
    return withData(async (data) => {
      const doc = await data.users.find().select('id nickname').exec()
      const users = doc.map((i) => {
        return { id: i.id, nickname: i.nickname }
      })
      console.log(doc[0].nickname)
      console.log(users)
      return res.status(200).json({ users })
    })
  })
}
