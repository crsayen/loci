import { httpStatus } from '../util/_httpStatus'
import { ServiceError } from './ServiceError'

export class Unauthorized extends ServiceError {
  constructor(message: string, cause?: any) {
    super(message, httpStatus.UNAUTHORIZED, cause)
    this.name = 'UNAUTHORIZED'
  }
}
