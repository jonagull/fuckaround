import {
    EmptyBody,
    GetUserParams,
    WeddingDetails,
} from "@weddingplanner/types";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../lib/types";
import { notFound, ApiError } from "../../lib/ApiError";

export const postWeddingDetailsFunction = asyncHandler<
    WeddingDetails,
    WeddingDetails,
    null
>(201, async (req) => {
    const {
        userId,
        partnerOneName,
        partnerTwoName,
        weddingDate,
        venue,
        guestEstimate,
    } = req.body;

    // Validate required fields
    if (
        !userId ||
        !partnerOneName ||
        !partnerTwoName ||
        !weddingDate ||
        !venue ||
        !guestEstimate
    ) {
        throw new ApiError(400, "Missing required fields");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    try {
        // Use upsert to create or update wedding details
        const weddingDetails = await prisma.weddingDetails.upsert({
            where: { userId },
            create: {
                userId,
                partnerOneName,
                partnerTwoName,
                weddingDate,
                venue,
                guestEstimate,
            },
            update: {
                partnerOneName,
                partnerTwoName,
                weddingDate,
                venue,
                guestEstimate,
            },
        });

        return {
            id: weddingDetails.id,
            userId: weddingDetails.userId,
            partnerOneName: weddingDetails.partnerOneName,
            partnerTwoName: weddingDetails.partnerTwoName,
            weddingDate: weddingDetails.weddingDate,
            venue: weddingDetails.venue,
            guestEstimate: weddingDetails.guestEstimate,
            createdAt: weddingDetails.createdAt,
            updatedAt: weddingDetails.updatedAt,
        };
    } catch (error) {
        console.error("Failed to save wedding details:", error);
        throw new ApiError(500, "Failed to save wedding details");
    }
});
