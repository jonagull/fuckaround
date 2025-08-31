"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitationFunction = void 0;
const weddingplanner_types_1 = require("weddingplanner-types");
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.createInvitationFunction = (0, types_1.asyncHandler)(201, async (req) => {
    const { eventId, guestInfo, additionalGuestsCount } = req.body;
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.badRequest)("User ID not found");
    // Check if user has permission to invite (must be OWNER or PLANNER)
    const userEvent = await prisma_1.prisma.userEvent.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId,
            },
        },
        select: {
            role: true,
        },
    });
    if (!userEvent) {
        return (0, ApiError_1.forbidden)("You don't have access to this event");
    }
    if (userEvent.role !== weddingplanner_types_1.EventRole.OWNER && userEvent.role !== weddingplanner_types_1.EventRole.PLANNER) {
        return (0, ApiError_1.forbidden)("Only event owners and planners can send invitations");
    }
    // Check if event exists
    const event = await prisma_1.prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        return (0, ApiError_1.notFound)("Event not found");
    }
    // Check if invitation already exists for this guest email
    const existingInvitation = await prisma_1.prisma.invitation.findUnique({
        where: {
            eventId_guestEmail: {
                eventId,
                guestEmail: guestInfo.email,
            },
        },
    });
    if (existingInvitation) {
        return (0, ApiError_1.badRequest)("An invitation already exists for this guest");
    }
    // Create the invitation
    const invitation = await prisma_1.prisma.invitation.create({
        data: {
            eventId,
            guestFirstName: guestInfo.firstName,
            guestLastName: guestInfo.lastName,
            guestEmail: guestInfo.email,
            guestPhoneNumber: guestInfo.phoneNumber,
            guestPhoneCountryCode: guestInfo.phoneCountryCode,
            additionalGuestsCount: additionalGuestsCount || 0,
            additionalGuests: [],
        },
    });
    return { id: invitation.id };
});
