import { NextApiResponse } from 'next'

export async function withErrorHandler<T>(res: NextApiResponse, fn: () => T) {
  try {
    await fn()
  } catch (e: any) {
    const status = e?.status ?? 500
    const message = e?.message ?? 'error bad. error not good'
    const cause = e?.cause ?? { name: null, message: null }
    const info = [status, message, cause.name, cause.message]
      .filter((s) => !!s)
      .join(' : ')
    return Promise.resolve(res.status(status).json({ message, info }))
  }
}
