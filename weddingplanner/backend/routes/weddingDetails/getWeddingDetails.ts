import {
    EmptyBody,
    GetUserParams,
    WeddingDetails,
} from "@weddingplanner/types";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../lib/types";
import { notFound, ApiError } from "../../lib/ApiError";

export const getWeddingDetailsFunction = asyncHandler<
    EmptyBody,
    WeddingDetails,
    GetUserParams
>(200, async (req) => {
    const { id: userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const weddingDetails = await prisma.weddingDetails.findUnique({
        where: { userId },
    });

    if (!weddingDetails) {
        throw new ApiError(404, "Wedding details not found");
    }

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
});
