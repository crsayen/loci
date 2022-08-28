import { httpStatus } from '../util/_httpStatus'
import { ServiceError } from './ServiceError'

export class MethodNotAllowed extends ServiceError {
  constructor(message: string, cause?: any) {
    super(message, httpStatus.METHOD_NOT_ALLOWED, cause)
    this.name = 'MethodNotAllowed'
  }
}
