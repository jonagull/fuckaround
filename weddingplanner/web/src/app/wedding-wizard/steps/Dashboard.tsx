"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeddingDetails } from "@weddingplanner/frontend-shared/api";

export default function Dashboard({ userId }: { userId: string }) {
    // Direct use of useQuery instead of the hook wrapper
    const { data, isLoading, error } = useQuery({
        queryKey: ["weddingDetails", userId],
        queryFn: () => {
            if (!userId) throw new Error("userId is required");
            return getWeddingDetails(userId);
        },
        enabled: !!userId,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading wedding details</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <h1>
                {data?.partnerOneName} & {data?.partnerTwoName}
            </h1>
            <p>Date: {data?.weddingDate}</p>
            <p>Venue: {data?.venue}</p>
            <p>Guests: {data?.guestEstimate}</p>
        </div>
    );
}
