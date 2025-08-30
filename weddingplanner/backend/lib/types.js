"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.apiError = exports.apiSuccess = void 0;
/**
 * Helper functions to create properly typed API responses
 */
const apiSuccess = (statusCode, data) => ({
    success: true,
    statusCode,
    data,
    error: null
});
exports.apiSuccess = apiSuccess;
const apiError = (statusCode, error) => ({
    success: false,
    statusCode,
    data: null,
    error
});
exports.apiError = apiError;
/**
 * Simple magic async wrapper that passes errors to error handling middleware
 * Automatically sends the response if a value is returned
 * Now automatically wraps request body in TypedRequest and response in ApiSuccess
 */
const asyncHandler = (statusCode, fn) => {
    return async (req, res, next) => {
        try {
            const result = await fn(req, res, next);
            if (result && !res.headersSent) {
                // Automatically wrap the result in ApiSuccess
                const apiResponse = (0, exports.apiSuccess)(statusCode, result);
                res.status(apiResponse.statusCode);
                res.json(apiResponse);
            }
        }
        catch (error) {
            next(error);
        }
    };
};
exports.asyncHandler = asyncHandler;
