import ApiClient from "./client";
import {
  LoginMobileResponse,
  LoginRequest,
  LogoutResponse,
  UserResponse,
} from "weddingplanner-types";

const client = new ApiClient();

export const authApi = {
  login: async (credentials: LoginRequest): Promise<UserResponse> => {
    return (await client.post("/auth/login/web", credentials)).data;
  },
  me: async (): Promise<UserResponse> => {
    return (await client.get("/auth/me")).data;
  },

  logout: async (): Promise<LogoutResponse> => {
    return (await client.post("/auth/logout")).data;
  },
};
