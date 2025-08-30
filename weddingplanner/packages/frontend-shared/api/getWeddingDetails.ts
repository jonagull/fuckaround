import type { WeddingDetails } from "@weddingplanner/types";

export async function getWeddingDetails(
    userId: string
): Promise<WeddingDetails> {
    const res = await fetch(
        `http://localhost:3070/api/wedding-details/${userId}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch wedding details: ${res.statusText}`);
    }

    return res.json() as Promise<WeddingDetails>;
}
