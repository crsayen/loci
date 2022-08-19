import { httpStatus } from '../util/_httpStatus'
import { ServiceError } from './ServiceError'

export class Forbidden extends ServiceError {
  constructor(message: string, cause?: any) {
    super(message, httpStatus.FORBIDDEN, cause)
    this.name = 'FORBIDDEN'
  }
}
