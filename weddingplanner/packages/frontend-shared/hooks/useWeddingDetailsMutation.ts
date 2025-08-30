import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { WeddingDetails } from "@weddingplanner/types";
import { postWeddingDetails, CreateWeddingDetailsRequest } from "../api/postWeddingDetails";

export function useWeddingDetailsMutation() {
    const queryClient = useQueryClient();

    return useMutation<WeddingDetails, Error, CreateWeddingDetailsRequest>({
        mutationFn: postWeddingDetails,
        onSuccess: (data) => {
            // Invalidate and refetch wedding details query
            queryClient.invalidateQueries({
                queryKey: ["weddingDetails", data.userId],
            });
            // Optionally set the data directly in the cache
            queryClient.setQueryData(["weddingDetails", data.userId], data);
        },
    });
}
