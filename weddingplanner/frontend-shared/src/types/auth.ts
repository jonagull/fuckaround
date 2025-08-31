// Request DTOs
export interface RequestLogin {
  email: string;
  password: string;
}

export interface RequestRegister {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface RequestRefreshMobile {
  refreshToken: string;
}

// Response DTOs
export interface ResponseUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface ResponseAuthWeb {
  accessToken: string;
  user: ResponseUser;
}

export interface ResponseAuthMobile {
  accessToken: string;
  refreshToken: string;
  user: ResponseUser;
}

// Legacy aliases for backward compatibility
export type LoginRequest = RequestLogin;
export type RegisterRequest = RequestRegister;
export type UserResponse = ResponseUser;
export type LoginWebResponse = ResponseAuthWeb;
export type LoginMobileResponse = ResponseAuthMobile;
export type RefreshRequest = RequestRefreshMobile;
export type RefreshResponse = { accessToken: string };
export type LogoutResponse = { message: string };
