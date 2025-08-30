import { StatusCode } from "weddingplanner-types";

export class ApiError extends Error {
  statusCode: StatusCode
    ;

  constructor(statusCode: StatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFound = (message = 'Not found'): never => { throw new ApiError(404, message) };
export const unauthorized = (message = 'Unauthorized'): never => { throw new ApiError(401, message) };
export const badRequest = (message = 'Bad request'): never => { throw new ApiError(400, message) };
export const forbidden = (message = 'Forbidden'): never => { throw new ApiError(403, message) };
export const conflict = (message = 'Conflict'): never => { throw new ApiError(409, message) };
export const internalError = (message = 'Internal server error'): never => { throw new ApiError(500, message) };