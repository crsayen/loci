import logger from './lib/logger'
import mongoose, { Connection } from 'mongoose'
import {
  lociSchema,
  ILoci,
  ILociModel,
  ILocus,
  ILocusModel,
  locusSchema,
} from './lib/model'

mongoose.Promise = global.Promise

let conn: Connection | null = null

export async function withData(
  fn: (loci: ILociModel, locus: ILocusModel) => void
) {
  if (conn == null) {
    const mongoUrl = process.env.MONGODB_URL ?? ''
    logger.info(`Connecting to MongoDB at ${mongoUrl}`)
    conn = mongoose.createConnection(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    })
  }

  await conn.asPromise()
  logger.info('Connected to MongoDB successfully')
  const Locus = conn.model<ILocus, ILocusModel>('Locus', locusSchema)
  const Loci = conn.model<ILoci, ILociModel>('Loci', lociSchema)
  try {
    fn(Loci, Locus)
  } catch (err) {
    logger.error(err)
  }
}
