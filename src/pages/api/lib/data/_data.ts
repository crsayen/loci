import mongoose, { Connection } from 'mongoose'
import {
  IPermission,
  IPermissionModel,
  IRole,
  IRoleModel,
  permissionSchema,
  roleSchema,
} from './models/_authz'
import { lociSchema, ILoci, ILociModel } from './models/_loci'
import { IUser, IUserModel, userSchema } from './models/_user'

mongoose.Promise = global.Promise

let conn: Connection | null = null

export type Data = {
  loci: ILociModel
  permissions: IPermissionModel
  roles: IRoleModel
  users: IUserModel
}

export async function withData(fn: (d: Data) => void) {
  if (conn == null) {
    const mongoUrl = process.env.MONGODB_URL ?? ''
    console.log(`Connecting to MongoDB at ${mongoUrl}`)
    conn = mongoose.createConnection(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    })
  }

  await conn.asPromise()
  console.log('Connected to MongoDB successfully')
  try {
    fn({
      loci: conn.model<ILoci, ILociModel>('Loci', lociSchema),
      permissions: conn.model<IPermission, IPermissionModel>(
        'Permission',
        permissionSchema
      ),
      roles: conn.model<IRole, IRoleModel>('Role', roleSchema),
      users: conn.model<IUser, IUserModel>('User', userSchema),
    })
  } catch (err) {
    console.error(err)
  }
}
