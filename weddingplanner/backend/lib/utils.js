"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpiryDate = void 0;
exports.requireExists = requireExists;
const ApiError_1 = require("./ApiError");
const weddingplanner_types_1 = require("weddingplanner-types");
function requireExists(value, errorMessage) {
  if (!value) (0, ApiError_1.notFound)(errorMessage);
}
const generateExpiryDate = () =>
  new Date(Date.now() + weddingplanner_types_1.REFRESH_TOKEN_EXPIRY_MS);
exports.generateExpiryDate = generateExpiryDate;
