"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvitationFunction = void 0;
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.updateInvitationFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const { invitationId } = req.params;
    const { acceptedAt, rejectedAt, additionalGuests } = req.body;
    // For now, this endpoint can be used by event organizers to update invitation status
    // In a real app, you might have a separate public endpoint for guests to respond
    const invitation = await prisma_1.prisma.invitation.findUnique({
        where: { id: invitationId },
    });
    if (!invitation) {
        return (0, ApiError_1.notFound)("Invitation not found");
    }
    // Validate that we're not both accepting and rejecting
    if (acceptedAt && rejectedAt) {
        return (0, ApiError_1.badRequest)("Cannot both accept and reject an invitation");
    }
    // Validate additional guests don't exceed allowed count
    if (additionalGuests && additionalGuests.length > invitation.additionalGuestsCount) {
        return (0, ApiError_1.badRequest)(`Cannot add more than ${invitation.additionalGuestsCount} additional guests`);
    }
    // Update the invitation
    const updatedInvitation = await prisma_1.prisma.invitation.update({
        where: { id: invitationId },
        data: {
            acceptedAt: acceptedAt ? new Date(acceptedAt) : invitation.acceptedAt,
            rejectedAt: rejectedAt ? new Date(rejectedAt) : invitation.rejectedAt,
            additionalGuests: additionalGuests ? JSON.parse(JSON.stringify(additionalGuests)) : undefined,
        },
    });
    // Transform to match the Invitation interface
    return {
        id: updatedInvitation.id,
        eventId: updatedInvitation.eventId,
        guestInfo: {
            firstName: updatedInvitation.guestFirstName,
            lastName: updatedInvitation.guestLastName,
            email: updatedInvitation.guestEmail,
            phoneNumber: updatedInvitation.guestPhoneNumber,
            phoneCountryCode: updatedInvitation.guestPhoneCountryCode,
        },
        invitedAt: updatedInvitation.invitedAt,
        acceptedAt: updatedInvitation.acceptedAt || undefined,
        rejectedAt: updatedInvitation.rejectedAt || undefined,
        additionalGuestsCount: updatedInvitation.additionalGuestsCount,
        additionalGuests: updatedInvitation.additionalGuests,
        createdAt: updatedInvitation.createdAt,
        updatedAt: updatedInvitation.updatedAt,
    };
});
