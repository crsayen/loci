import { HttpStatusCode } from '../util/_httpStatus'

export class ServiceError extends Error {
  status: HttpStatusCode
  constructor(message: string, status: HttpStatusCode, cause?: any) {
    super(message)
    this.name = 'ServiceError'
    this.status = status
    this.cause = cause
  }
}
