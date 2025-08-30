"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = void 0;
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.me = (0, types_1.asyncHandler)(200, async (req) => {
    const userId = req.userId;
    if (!userId)
        throw new Error('User ID not found in request');
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true
        }
    }) ?? (0, ApiError_1.notFound)('User not found');
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
});
