import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { LoginRequest } from "weddingplanner-types";

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

export const useMe = () => {
    return useQuery({
        queryKey: ['auth', 'user'],
        queryFn: authApi.me,
    });
}

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            // Clear all auth-related queries
            queryClient.removeQueries({ queryKey: ['auth', 'user'] });
            queryClient.removeQueries({ queryKey: ['auth'] });
            
            // Clear the entire cache to ensure clean state
            queryClient.clear();
            
            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        },
        onError: () => {
            // Even if logout fails on the server, clear local state
            queryClient.removeQueries({ queryKey: ['auth', 'user'] });
            queryClient.removeQueries({ queryKey: ['auth'] });
            queryClient.clear();
            
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    });
};
