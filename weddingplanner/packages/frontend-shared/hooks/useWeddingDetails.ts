import { useQuery } from "@tanstack/react-query";
import type { WeddingDetails } from "@weddingplanner/types";
import { getWeddingDetails } from "../api";

export function useWeddingDetails(userId: string | undefined) {
    return useQuery<WeddingDetails>({
        queryKey: ["weddingDetails", userId],
        queryFn: () => {
            if (!userId) throw new Error("userId is required");
            return getWeddingDetails(userId);
        },
        enabled: !!userId, // don’t run unless userId is provided
    });
}
