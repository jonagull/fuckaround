import { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/ApiError";
import { apiError } from "../lib/types";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(apiError(err.statusCode, err.message));
  }

  // Handle other errors
  console.error("Unhandled error:", err);
  res.status(500).json(apiError(500, "Internal server error"));
};
