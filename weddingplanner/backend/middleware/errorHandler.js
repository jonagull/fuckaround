"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../lib/ApiError");
const types_1 = require("../lib/types");
const errorHandler = (err, req, res, next) => {
  // Handle ApiError instances
  if (err instanceof ApiError_1.ApiError) {
    return res.status(err.statusCode).json((0, types_1.apiError)(err.statusCode, err.message));
  }
  // Handle other errors
  console.error("Unhandled error:", err);
  res.status(500).json((0, types_1.apiError)(500, "Internal server error"));
};
exports.errorHandler = errorHandler;
