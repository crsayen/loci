import { httpStatus } from '../util/_httpStatus'
import { ServiceError } from './ServiceError'

export class BadRequest extends ServiceError {
  constructor(message: string, cause?: any) {
    super(message, httpStatus.BAD_REQUEST, cause)
    this.name = 'BadRequest'
  }
}
