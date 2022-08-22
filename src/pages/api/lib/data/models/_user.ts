import { Model, Schema, Document } from 'mongoose'

export type User = {
  id: string
  nickname: string
  roles: Array<string>
  loci: Array<string>
}

export interface IUser extends Document {
  id: string
  nickname: string
  roles: Array<string>
  loci: Array<string>
}

export const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nickname: { type: String, required: false },
    roles: { type: [String], required: true },
    loci: { type: [String], required: true },
  },
  { timestamps: true }
)

export interface IUserModel extends Model<IUser> {}
