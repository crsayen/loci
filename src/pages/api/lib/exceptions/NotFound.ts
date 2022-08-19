import { httpStatus } from '../util/_httpStatus'
import { ServiceError } from './ServiceError'

export class NotFound extends ServiceError {
  constructor(message: string, cause?: any) {
    super(message, httpStatus.NOT_FOUND, cause)
    this.name = 'NotFound'
  }
}
