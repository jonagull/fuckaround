export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: StatusCode;
  data: T;
  error: string | null;
}

export interface ApiError {
  success: false;
  statusCode: StatusCode;
  data: null;
  error: string;
}

export interface ApiSuccess<T> {
  success: true;
  statusCode: StatusCode;
  data: T;
  error: null;
}

export interface EmptyBody { }


export type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 500;