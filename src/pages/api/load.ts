import type { NextApiRequest, NextApiResponse } from 'next'
import { Permission, Role } from './lib/data/models/_authz'
import { Loci } from './lib/data/models/_loci'
import { User } from './lib/data/models/_user'
import { withData } from './lib/data/_data'
import lociList from './lib/_lociList'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Loci>
) {
  withData(async (data) => {
    const permissions: Array<Permission> = [
      {
        grant: 'write:user.loci',
        description: "write the user's own loci",
      },
      {
        grant: 'read:user.loci',
        description: "read the user's own loci",
      },
      {
        grant: 'read:user.locus',
        description: "read locations of the user's own items",
      },
      {
        grant: 'create:permission',
        description: 'create new permission',
      },
      {
        grant: 'create:role',
        description: 'create new role',
      },
      {
        grant: 'assign:role',
        description: 'assign a role to a user',
      },
      {
        grant: 'assign:permission',
        description: 'assign a permission to a role',
      },
      { grant: 'read:any.user', description: 'read any user' },
      { grant: 'write:any.user', description: 'modify any user' },
    ]

    await data.permissions.create(permissions)

    const role: Role = {
      name: 'HIMSELF',
      permissions: permissions.map((p) => p.grant),
    }

    await data.roles.create(role)

    const user: User = {
      id: 'google-oauth2|103474783628012635639',
      loci: lociList.map((l) => l.name),
      roles: [role.name],
    }

    await data.users.create(user)
    res.status(200)
  })
}
