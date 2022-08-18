import { Model, Schema, Document } from 'mongoose'

export interface Locus {
  locus: string
  count: number
}

export interface Loci {
  name: string
  loci: Array<Locus>
  description: string
}

export interface ILocus extends Document {
  locus: string
  count: number
}

export interface ILoci extends Document {
  name: string
  loci: Array<ILocus>
  description: string
}

export interface ILocusModel extends Model<ILocus> {}
export interface ILociModel extends Model<ILoci> {}

export const locusSchema = new Schema<ILocus>(
  {
    locus: { type: String, required: true, index: true },
    count: { type: Number, required: false },
  },
  { timestamps: true }
)

export const lociSchema = new Schema<ILoci>(
  {
    name: { type: String, unique: true, required: true },
    loci: { type: [locusSchema], required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
)
