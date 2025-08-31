import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { type RequestLogin, type RequestRegister, type ResponseUser, type ResponseAuthWeb } from "../types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseAuthWeb, Error, RequestLogin>({
    mutationFn: (credentials: RequestLogin) => authApi.login(credentials),
    onSuccess: async (data) => {
      // Set only the user data in the cache, not the entire auth response
      await queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
};

export const useMe = () => useQuery<ResponseUser | null>({
  queryKey: ["auth", "user"],
  queryFn: authApi.me,
  retry: false,
  enabled: true,
});

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseAuthWeb, Error, RequestRegister>({
    mutationFn: (credentials: RequestRegister) => authApi.webRegister(credentials),
    onSuccess: async (data) => {
      // Set only the user data in the cache
      await queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
};
