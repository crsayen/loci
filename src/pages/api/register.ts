import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/data/models/_loci'
import { User } from './lib/data/models/_user'
import { NotFound } from './lib/exceptions/NotFound'
import { withData } from './lib/util/wrappers/_data'
import { withErrorHandler } from './lib/util/wrappers/_handler'
import { hasAuthority } from './lib/util/wrappers/_tokenValidation'
import { verify } from './lib/util/wrappers/_tokenValidation'

export interface UserListData {
  users: Array<string>
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandler(res, () => {
    return withData(async (data) => {
      const { nickname } = req.query as { nickname: string | undefined }
      const { sub } = await verify(req.headers?.authorization?.substring('bearer '.length) ?? '')
      const user = await data.users.findOne({ id: sub }, { nickname: 1 }).exec()
      if (user) {
        // user exists
        if (!user.nickname) {
          // user does not have a nickname
          if (!nickname) {
            // no nickname was provided
            return res.status(404).end()
          } else {
            // a nickname was provided
            user.nickname = nickname
            await user.save()
          }
        } else {
          // user already has a nickname
          if (nickname && nickname != user.nickname) {
            // nickname provided that is new
            user.nickname = nickname
            await user.save()
          }
        }
      } else {
        // user does not exist
        const newUser: User = { id: sub as string, nickname: '', roles: [], loci: [] }
        await data.users.create(newUser)
        return res.status(404).end()
      }
      return res.status(200).end()
    })
  })
}
