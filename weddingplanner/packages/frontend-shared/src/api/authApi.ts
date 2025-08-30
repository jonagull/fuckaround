import ApiClient from "./client";
import { LoginMobileResponse, LoginRequest, UserResponse } from "weddingplanner-types";

const client = new ApiClient();

export const authApi = {
<<<<<<< Updated upstream
    login: async (credentials: LoginRequest): Promise<UserResponse> => {
        return (await client.post('/auth/login/web', credentials)).data;
    },
    me: async (): Promise<UserResponse> => {
        return (await client.get('/auth/me')).data;
    }
};  
=======
    login: async (credentials: LoginRequest) => {
        return await client.post("/auth/login/web", credentials);
    },
    logout: async () => {
        return await client.post("/auth/logout");
    },
};
>>>>>>> Stashed changes
