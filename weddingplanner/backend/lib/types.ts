import { Request, Response, NextFunction } from 'express';
import { ApiSuccess, ApiError } from '@weddingplanner/types';

/**
 * Simple typed request - just type the body, params, and query
 */
export type TypedRequest<Body = any, Params = any, Query = any> = Request<Params, any, Body, Query>;

/**
 * Simple typed response - ensures we always return ApiSuccess or ApiError
 */
export type TypedResponse<T = unknown> = Response<ApiSuccess<T> | ApiError>;

/**
 * Helper functions to create properly typed API responses
 */
export const apiSuccess = <T>(statusCode: number, data: T): ApiSuccess<T> => ({
  success: true,
  statusCode,
  data,
  error: null
});

export const apiError = (statusCode: number, error: string): ApiError => ({
  success: false,
  statusCode,
  data: null,
  error
});

/**
 * Simple magic async wrapper that passes errors to error handling middleware
 * Automatically sends the response if a value is returned
 * Now automatically wraps request body in TypedRequest and response in ApiSuccess
 */
export const asyncHandler = <BodyType = unknown, ResponseType = unknown, ParamsType = unknown>(
  statusCode: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500,
  fn: (req: TypedRequest<BodyType, ParamsType>, res: TypedResponse<ResponseType>, next: NextFunction) => Promise<ResponseType | void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req as TypedRequest<BodyType, ParamsType>, res, next);

      if (result && !res.headersSent) {

        // Automatically wrap the result in ApiSuccess
        const apiResponse = apiSuccess(statusCode, result);
        res.status(apiResponse.statusCode);
        res.json(apiResponse);

      }
    } catch (error) {
      next(error);
    }
  };
};