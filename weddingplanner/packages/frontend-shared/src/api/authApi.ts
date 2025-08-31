import ApiClient from "./client";
import {
  LoginRequest,
  LogoutResponse,
  UserResponse,
} from "weddingplanner-types";

const client = new ApiClient();

export const authApi = {
  login: async (credentials: LoginRequest): Promise<UserResponse> => (await client.post("/auth/login/web", credentials)).data,
  me: async (): Promise<UserResponse> => (await client.get("/auth/me")).data,
  logout: async (): Promise<LogoutResponse> => (await client.post("/auth/logout")).data,
}
