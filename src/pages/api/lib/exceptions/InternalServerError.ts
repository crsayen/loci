import { httpStatus } from '../util/_httpStatus'
import { ServiceError } from './ServiceError'

export class InternalServerError extends ServiceError {
  constructor(message: string, cause?: any) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, cause)
    this.name = 'INTERNAL_SERVER_ERROR'
  }
}
