"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
/**
 * Generates a short-lived access token for user authentication
 * @param userId - The unique identifier of the user
 * @returns A JWT access token that expires in 15 minutes
 * @example
 * ```typescript
 * const accessToken = generateAccessToken('user123');
 * ```
 */
const generateAccessToken = (userId) => jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
exports.generateAccessToken = generateAccessToken;
/**
 * Generates a long-lived refresh token for obtaining new access tokens
 * @param userId - The unique identifier of the user
 * @returns A JWT refresh token that expires in 7 days
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken('user123');
 * ```
 */
const generateRefreshToken = (userId) => jsonwebtoken_1.default.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verifies and decodes an access token
 * @param token - The JWT access token to verify
 * @returns The decoded token payload containing the userId
 * @throws {JsonWebTokenError} If the token is invalid, expired, or malformed
 * @throws {TokenExpiredError} If the token has expired
 * @example
 * ```typescript
 * try {
 *   const payload = verifyAccessToken(accessToken);
 *   console.log('User ID:', payload.userId);
 * } catch (error) {
 *   console.error('Token verification failed:', error.message);
 * }
 * ```
 */
const verifyAccessToken = (token) => jsonwebtoken_1.default.verify(token, JWT_SECRET);
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verifies and decodes a refresh token
 * @param token - The JWT refresh token to verify
 * @returns The decoded token payload containing the userId
 * @throws {JsonWebTokenError} If the token is invalid, expired, or malformed
 * @throws {TokenExpiredError} If the token has expired
 * @example
 * ```typescript
 * try {
 *   const payload = verifyRefreshToken(refreshToken);
 *   console.log('User ID:', payload.userId);
 * } catch (error) {
 *   console.error('Token verification failed:', error.message);
 * }
 * ```
 */
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
