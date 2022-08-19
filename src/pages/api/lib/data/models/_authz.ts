import { Model, Schema, Document } from 'mongoose'

export type Permission = {
  grant: string
  description: string
}

export interface IPermission extends Document {
  grant: string
  description: string
}

export const permissionSchema = new Schema<IPermission>(
  {
    grant: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
)

export interface IPermissionModel extends Model<IPermission> {}

export type Role = {
  name: string
  permissions: Array<string>
}

export interface IRole extends Document {
  name: string
  permissions: Array<string>
}

export interface IRoleModel extends Model<IRole> {}

export const roleSchema = new Schema<IRole>(
  {
    name: { type: String, unique: true, index: true, required: true },
    permissions: { type: [String], required: true },
  },
  { timestamps: true }
)
