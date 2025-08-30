import { EmptyBody, UserResponse } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest, TypedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/ApiError";


export const me = asyncHandler<EmptyBody, UserResponse>(200, async (req: AuthenticatedRequest<EmptyBody>) => {
    const userId = req.userId;

    if (!userId) throw new Error('User ID not found in request');


    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true
        }
    }) ?? notFound('User not found');

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
});