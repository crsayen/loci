import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/data/models/_loci'
import { NotFound } from './lib/exceptions/NotFound'
import { withData } from './lib/util/wrappers/_data'
import { withErrorHandler } from './lib/util/wrappers/_handler'
import { hasAuthority } from './lib/util/wrappers/_tokenValidation'

export interface UserListData {
  users: Array<string>
}

export default function handleRoot(
  req: NextApiRequest,
  res: NextApiResponse<UserListData>
) {
  withErrorHandler(res, () => {
    withData(async (data) => {
      const doc = await data.users.find({}, { id: 1 }).exec()
      console.log(
        'users',
        doc.map((u) => u.id)
      )
      return res.status(200).json({
        users: doc.map((i) => i.id),
      })
    })
  })
}
