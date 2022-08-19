import type { NextApiRequest, NextApiResponse } from 'next'
import { Loci } from './lib/data/models/_loci'
import { hasAuthority } from './lib/_tokenValidation'
import { withData } from './lib/data/_data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Loci>
) {
  withData(async (data) => {
    if (!(await hasAuthority(req, 'read:locus'))) return res.status(403).end()
    // const { lociName } = req.query
    // const { name, loci } = await data.loci
    //   .findOne({ name: lociName })
    //   .orFail()
    res.status(200).json({ name: 'blank', owner: 'none', items: [] })
  })
}
