import ApiClient from "./client";
import {
  RequestLogin,
  RequestRegister,
  ResponseUser,
  ResponseAuthWeb,
  ResponseAuthMobile,
  RequestRefreshMobile,
  LogoutResponse,
} from "../types";

const client = new ApiClient();

export const authApi = {
  // Current user
  me: async (): Promise<ResponseUser> => {
    try {
      const data = await client.get<ResponseUser>("/auth/me");
      return data || null;
    } catch (error) {
      return null as any;
    }
  },

  // Web endpoints (httpOnly cookies)
  webRegister: async (data: RequestRegister): Promise<ResponseAuthWeb> =>
    await client.post<ResponseAuthWeb, RequestRegister>("/auth/web/register", data),
  webLogin: async (credentials: RequestLogin): Promise<ResponseAuthWeb> =>
    await client.post<ResponseAuthWeb, RequestLogin>("/auth/web/login", credentials),
  webRefresh: async (): Promise<ResponseAuthWeb> =>
    await client.post<ResponseAuthWeb>("/auth/web/refresh"),
  webLogout: async (): Promise<LogoutResponse> =>
    await client.post<LogoutResponse>("/auth/web/logout"),

  // Mobile endpoints (tokens in response body)
  mobileRegister: async (data: RequestRegister): Promise<ResponseAuthMobile> =>
    await client.post<ResponseAuthMobile, RequestRegister>("/auth/mobile/register", data),
  mobileLogin: async (credentials: RequestLogin): Promise<ResponseAuthMobile> =>
    await client.post<ResponseAuthMobile, RequestLogin>("/auth/mobile/login", credentials),
  mobileRefresh: async (data: RequestRefreshMobile): Promise<ResponseAuthMobile> =>
    await client.post<ResponseAuthMobile, RequestRefreshMobile>("/auth/mobile/refresh", data),
  mobileLogout: async (data: RequestRefreshMobile): Promise<LogoutResponse> =>
    await client.post<LogoutResponse, RequestRefreshMobile>("/auth/mobile/logout", data),

  // Legacy aliases for backward compatibility
  login: async (credentials: RequestLogin): Promise<ResponseAuthWeb> =>
    await client.post<ResponseAuthWeb, RequestLogin>("/auth/web/login", credentials),
  logout: async (): Promise<LogoutResponse> =>
    await client.post<LogoutResponse>("/auth/web/logout"),
}
