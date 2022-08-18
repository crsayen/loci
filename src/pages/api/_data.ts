import mongoose, { Connection } from 'mongoose'
import {
  lociSchema,
  ILoci,
  ILociModel,
  ILocus,
  ILocusModel,
  locusSchema,
} from './lib/_model'

mongoose.Promise = global.Promise

let conn: Connection | null = null

export async function withData(
  fn: (loci: ILociModel, locus: ILocusModel) => void
) {
  if (conn == null) {
    const mongoUrl = process.env.MONGODB_URL ?? ''
    console.log(`Connecting to MongoDB at ${mongoUrl}`)
    conn = mongoose.createConnection(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    })
  }

  await conn.asPromise()
  console.log('Connected to MongoDB successfully')
  const Locus = conn.model<ILocus, ILocusModel>('Locus', locusSchema)
  const Loci = conn.model<ILoci, ILociModel>('Loci', lociSchema)
  try {
    fn(Loci, Locus)
  } catch (err) {
    console.error(err)
  }
}
