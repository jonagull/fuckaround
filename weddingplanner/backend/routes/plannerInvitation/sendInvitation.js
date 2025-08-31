"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPlannerInvitation = void 0;
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
const roleHierarchy_1 = require("../../lib/roleHierarchy");
exports.sendPlannerInvitation = (0, types_1.asyncHandler)(201, async (req) => {
    const { eventId, receiverEmail, role, message } = req.body;
    const senderId = req.userId;
    if (!senderId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    if (!role)
        return (0, ApiError_1.badRequest)("Role is required");
    // Check sender's role in the event
    const senderEventRole = await prisma_1.prisma.userEvent.findFirst({
        where: {
            eventId,
            userId: senderId
        }
    });
    if (!senderEventRole) {
        return (0, ApiError_1.forbidden)("You don't have permission to invite users to this event");
    }
    // Validate role hierarchy
    if (!(0, roleHierarchy_1.canInviteToRole)(senderEventRole.role, role)) {
        return (0, ApiError_1.forbidden)(`You cannot invite users as ${role}. Your role (${senderEventRole.role}) can only invite to roles at or below your level.`);
    }
    // Find receiver by email
    const receiver = await prisma_1.prisma.user.findUnique({
        where: { email: receiverEmail }
    });
    if (!receiver) {
        return (0, ApiError_1.notFound)("User not found with this email");
    }
    if (receiver.id === senderId) {
        return (0, ApiError_1.badRequest)("You cannot invite yourself");
    }
    // Check if receiver is already part of the event
    const existingRole = await prisma_1.prisma.userEvent.findFirst({
        where: {
            eventId,
            userId: receiver.id
        }
    });
    if (existingRole) {
        return (0, ApiError_1.badRequest)("User is already part of this event");
    }
    // Check if invitation already exists
    const existingInvitation = await prisma_1.prisma.plannerInvitation.findUnique({
        where: {
            eventId_receiverId: {
                eventId,
                receiverId: receiver.id
            }
        }
    });
    if (existingInvitation && existingInvitation.status === "PENDING") {
        return (0, ApiError_1.badRequest)("An invitation is already pending for this user");
    }
    // Create or update invitation
    const invitation = await prisma_1.prisma.plannerInvitation.upsert({
        where: {
            eventId_receiverId: {
                eventId,
                receiverId: receiver.id
            }
        },
        update: {
            status: "PENDING",
            senderId,
            role: role,
            message,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        create: {
            eventId,
            senderId,
            receiverId: receiver.id,
            role: role,
            message,
            status: "PENDING",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
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
        }
    });
    return {
        invitation
    };
});
