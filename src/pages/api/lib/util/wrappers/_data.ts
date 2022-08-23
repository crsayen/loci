import mongoose, { Connection } from 'mongoose'
import {
  IPermission,
  IPermissionModel,
  IRole,
  IRoleModel,
  permissionSchema,
  roleSchema,
} from '../../data/models/_authz'
import { lociSchema, ILoci, ILociModel } from '../../data/models/_loci'
import { IUser, IUserModel, userSchema } from '../../data/models/_user'

mongoose.Promise = global.Promise

let conn: Connection | null = null

export type Data = {
  loci: ILociModel
  permissions: IPermissionModel
  roles: IRoleModel
  users: IUserModel
}

export async function withData<T>(fn: (d: Data) => T) {
  if (conn == null) {
    const mongoUrl = process.env.MONGODB_URL ?? ''
    conn = mongoose.createConnection(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    })
  }

  await conn.asPromise()
  return await fn({
    loci: conn.model<ILoci, ILociModel>('Loci', lociSchema),
    permissions: conn.model<IPermission, IPermissionModel>(
      'Permission',
      permissionSchema
    ),
    roles: conn.model<IRole, IRoleModel>('Role', roleSchema),
    users: conn.model<IUser, IUserModel>('User', userSchema),
  })
}
