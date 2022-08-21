import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/data/models/_loci'
import { NotFound } from './lib/exceptions/NotFound'
import { withData } from './lib/util/wrappers/_data'
import { withErrorHandler } from './lib/util/wrappers/_handler'
import { hasAuthority } from './lib/util/wrappers/_tokenValidation'
import { verify } from './lib/util/wrappers/_tokenValidation'

export interface UserListData {
  users: Array<string>
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  withErrorHandler(res, () => {
    withData(async (data) => {
      const { nickname } = req.query as { nickname: string | undefined }
      const { sub } = await verify(
        req.headers?.authorization?.substring('bearer '.length) ?? ''
      )
      const user = await data.users.findOne({ id: sub }, { nickname: 1 }).exec()
      if (user) {
        if (nickname && user.nickname != nickname) {
          user.update({ nickname })
          user.save()
        }
        return res.status(200).end()
      }
      return res.status(404).end()
    })
  })
}
