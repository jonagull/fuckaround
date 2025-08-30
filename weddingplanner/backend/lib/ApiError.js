"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalError =
  exports.conflict =
  exports.forbidden =
  exports.badRequest =
  exports.unauthorized =
  exports.notFound =
  exports.ApiError =
    void 0;
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ApiError = ApiError;
const notFound = (message = "Not found") => {
  throw new ApiError(404, message);
};
exports.notFound = notFound;
const unauthorized = (message = "Unauthorized") => {
  throw new ApiError(401, message);
};
exports.unauthorized = unauthorized;
const badRequest = (message = "Bad request") => {
  throw new ApiError(400, message);
};
exports.badRequest = badRequest;
const forbidden = (message = "Forbidden") => {
  throw new ApiError(403, message);
};
exports.forbidden = forbidden;
const conflict = (message = "Conflict") => {
  throw new ApiError(409, message);
};
exports.conflict = conflict;
const internalError = (message = "Internal server error") => {
  throw new ApiError(500, message);
};
exports.internalError = internalError;
