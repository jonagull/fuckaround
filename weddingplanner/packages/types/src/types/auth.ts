export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

export interface LoginWebResponse extends UserResponse {}

export interface LoginMobileResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken?: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutResponse {
  success: boolean;
}