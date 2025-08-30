import type { WeddingDetails } from "@weddingplanner/types";

export interface CreateWeddingDetailsRequest {
    userId: string;
    partnerOneName: string;
    partnerTwoName: string;
    weddingDate: string;
    venue: string;
    guestEstimate: number;
}

export async function postWeddingDetails(
    weddingDetails: CreateWeddingDetailsRequest
): Promise<WeddingDetails> {
    const res = await fetch(`http://localhost:3070/api/wedding-details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(weddingDetails),
    });

    if (!res.ok) {
        throw new Error(`Failed to create wedding details: ${res.statusText}`);
    }

    return res.json() as Promise<WeddingDetails>;
}
