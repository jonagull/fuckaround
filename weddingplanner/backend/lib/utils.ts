import { notFound } from "./ApiError";
import { REFRESH_TOKEN_EXPIRY_MS } from "weddingplanner-types";

export function requireExists<T>(
  value: T | null | undefined,
  errorMessage: string
): asserts value is T {
  if (!value) notFound(errorMessage);
}

export const generateExpiryDate = (): Date => new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
