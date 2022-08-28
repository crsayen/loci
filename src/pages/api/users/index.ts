import type { NextApiRequest, NextApiResponse } from 'next'
import { withData } from '../lib/util/wrappers/_data'
import { withErrorHandler } from '../lib/util/wrappers/_handler'

/*
  /users
  GET -> all user ids and nicknames
*/

export interface UserListData {
  users: Array<{ id: string; nickname: string }>
}

export default function handleGet(req: NextApiRequest, res: NextApiResponse<UserListData>) {
  return withErrorHandler(res, () =>
    withData(async (data) => {
      const doc = await data.users.find().select('id nickname').exec()
      const users = doc.map((i) => {
        return { id: i.id, nickname: i.nickname }
      })
      return res.status(200).json({ users })
    })
  )
}
