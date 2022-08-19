import { withData } from './_data'
import { DEFAULT_ROLE } from '@/constants'
import { Permission, Role } from './models/_authz'
import { User } from './models/_user'

export async function registerUser(userId: string): Promise<User> {
  withData(async (data) => {
    const { id, roles } =
      data.users.findOne({ id: userId }).or(null) ??
      (await data.users.create({ id, roles: [DEFAULT_ROLE] }))
  })
}

export async function createPermission(permission: Permission) {
  withData((data) => data.permissions.create(permission))
}

export async function createRole(role: Role) {
  withData((data) => data.roles.create(role))
}
