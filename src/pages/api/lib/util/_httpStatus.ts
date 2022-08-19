export type HttpStatusCode = 200 | 400 | 401 | 403 | 404 | 500

export const httpStatus: Record<string, HttpStatusCode> = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}
