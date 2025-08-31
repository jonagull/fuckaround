"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlannerInvitations = void 0;
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.listPlannerInvitations = (0, types_1.asyncHandler)(200, async (req) => {
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    // Get invitations sent by the user
    const sent = await prisma_1.prisma.plannerInvitation.findMany({
        where: {
            senderId: userId,
            status: "PENDING"
        },
        include: {
            event: {
                select: {
                    id: true,
                    eventName: true,
                    eventDescription: true,
                    eventType: true,
                    eventDate: true
                }
            },
            sender: {
                select: { id: true, name: true, email: true }
            },
            receiver: {
                select: { id: true, name: true, email: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Get invitations received by the user
    const received = await prisma_1.prisma.plannerInvitation.findMany({
        where: {
            receiverId: userId,
            status: "PENDING",
            expiresAt: {
                gt: new Date() // Only show non-expired invitations
            }
        },
        include: {
            event: {
                select: {
                    id: true,
                    eventName: true,
                    eventDescription: true,
                    eventType: true,
                    eventDate: true
                }
            },
            sender: {
                select: { id: true, name: true, email: true }
            },
            receiver: {
                select: { id: true, name: true, email: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return { sent, received };
});
