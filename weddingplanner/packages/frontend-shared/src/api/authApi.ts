import ApiClient from "./client";
import { LoginRequest } from "weddingplanner-types";

const client = new ApiClient();

export const authApi = {
    login: async (credentials: LoginRequest) => {
        return await client.post('/auth/login/web', credentials);
    }
};  