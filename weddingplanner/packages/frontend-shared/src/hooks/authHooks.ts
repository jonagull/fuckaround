import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { LoginRequest } from "@weddingplanner/types";

export const useLogin = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: async (data) => {
            await queryClient.setQueryData(['auth', 'user'], data);
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        }
    })

}