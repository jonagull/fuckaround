"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvitationsFunction = void 0;
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.getInvitationsFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const { eventId } = req.params;
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.forbidden)("User ID not found");
    // Check if user has permission to view invitations (must be part of the event)
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
    // Get all invitations for the event
    const invitations = await prisma_1.prisma.invitation.findMany({
        where: { eventId },
        orderBy: { createdAt: "desc" },
    });
    // Transform to match the Invitation interface
    return invitations.map((inv) => ({
        id: inv.id,
        eventId: inv.eventId,
        guestInfo: {
            firstName: inv.guestFirstName,
            lastName: inv.guestLastName,
            email: inv.guestEmail,
            phoneNumber: inv.guestPhoneNumber,
            phoneCountryCode: inv.guestPhoneCountryCode,
        },
        invitedAt: inv.invitedAt,
        acceptedAt: inv.acceptedAt || undefined,
        rejectedAt: inv.rejectedAt || undefined,
        additionalGuestsCount: inv.additionalGuestsCount,
        additionalGuests: inv.additionalGuests,
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
    }));
});
