import { prisma } from '../../lib/prisma';
import { asyncHandler } from '../../lib/types';
import { notFound } from '../../lib/ApiError';
import { EmptyBody, GetUserParams, User } from '@weddingplanner/types';

export const getUserFunction = asyncHandler<EmptyBody, User, GetUserParams>(200, async (req) => {
    const { id } = req.params;

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
