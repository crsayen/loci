import { Document, Model, Schema } from 'mongoose'

export type Locus = {
  locus: string
  count: number
}

interface ILocus extends Document {
  locus: string
  count: number
}

const locusSchema = new Schema<ILocus>(
  {
    locus: { type: String, required: true, index: true },
    count: { type: Number, required: false },
  },
  { timestamps: true }
)

export type Item = {
  name: string
  locations: Array<Locus>
  description: string
}

export interface IItem extends Document {
  name: string
  locations: Array<ILocus>
  description: string
}

const itemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, index: true },
    locations: { type: [locusSchema], required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
)

export type Loci = {
  owner: string
  name: string
  items: Array<Item>
}

export interface ILoci extends Document {
  owner: string
  name: string
  items: Array<IItem>
}

export interface ILociModel extends Model<ILoci> {}

export const lociSchema = new Schema<ILoci>(
  {
    owner: { type: String, required: true },
    name: { type: String, required: true },
    items: { type: [itemSchema], required: true },
  },
  { timestamps: true }
)

lociSchema.index({ owner: 1, name: -1 }, { unique: true })
