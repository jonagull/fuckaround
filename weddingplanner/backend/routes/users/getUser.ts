import { EmptyBody, GetUserParams, User } from 'weddingplanner-types';
import { prisma } from '../../lib/prisma';
import { asyncHandler, TypedRequest } from '../../lib/types';
import { notFound, forbidden } from '../../lib/ApiError';

type AuthenticatedRequest = TypedRequest<EmptyBody, GetUserParams> & {
    userId?: string;
};

export const getUserFunction = asyncHandler<EmptyBody, User, GetUserParams>(200, async (req: AuthenticatedRequest) => {
    const { id } = req.params;
    const authenticatedUserId = req.userId;

    if (id !== authenticatedUserId) forbidden('You can only access your own user data');


    const select = {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true
    }

    const user = await prisma.user.findUnique({ where: { id }, select }) ?? notFound('User not found');

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
});
