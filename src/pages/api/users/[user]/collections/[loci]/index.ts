import { MethodNotAllowed } from '@/pages/api/lib/exceptions/MethodNotAllowed'
import { NotFound } from '@/pages/api/lib/exceptions/NotFound'
import { Data, withData } from '@/pages/api/lib/util/wrappers/_data'
import { withErrorHandler } from '@/pages/api/lib/util/wrappers/_handler'
import { withAuth } from '@/pages/api/lib/util/wrappers/_tokenValidation'
import { NextApiRequest, NextApiResponse } from 'next'

/*
  /users/:user/collections/:loci
  DELETE delete the collection -> 204
*/

async function handleDelete(req: NextApiRequest, res: NextApiResponse, data: Data) {
  const { user, loci } = req.query as { user: string; loci: string }
  await withAuth(
    req,
    res,
    ['write:any.collection'],
    async () => {
      const lociDoc = await data.loci.findOne({ owner: user, loci }).exec()
      if (lociDoc == null) throw new NotFound(`Loci '${loci}' not found for user '${user}'`)
      await lociDoc.delete()
      const userDoc = await data.users.findOne({ id: user }).orFail()
      userDoc.loci = userDoc.loci.filter((l) => l != loci)
      await userDoc.save()
      return res.status(204).end()
    },
    { orIsUser: user }
  )
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandler(res, () =>
    withData(async (data) => {
      if (req.method?.toUpperCase() == 'DELETE') {
        await handleDelete(req, res, data)
      } else {
        throw new MethodNotAllowed(`'${req.method}' not allowed`)
      }
    })
  )
}
