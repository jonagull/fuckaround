"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondPlannerInvitation = void 0;
const weddingplanner_types_1 = require("weddingplanner-types");
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.respondPlannerInvitation = (0, types_1.asyncHandler)(200, async (req) => {
    const userId = req.userId;
    const { invitationId, action } = req.params;
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    // Find the invitation
    const invitation = await prisma_1.prisma.plannerInvitation.findUnique({
        where: { id: invitationId },
        include: {
            event: true
        }
    });
    if (!invitation) {
        return (0, ApiError_1.notFound)("Invitation not found");
    }
    // Check if the user is the receiver
    if (invitation.receiverId !== userId) {
        return (0, ApiError_1.forbidden)("You can only respond to your own invitations");
    }
    // Check if invitation is still pending
    if (invitation.status !== "PENDING") {
        return (0, ApiError_1.badRequest)(`This invitation has already been ${invitation.status.toLowerCase()}`);
    }
    // Check if invitation has expired
    if (new Date(invitation.expiresAt) < new Date()) {
        // Update status to expired
        await prisma_1.prisma.plannerInvitation.update({
            where: { id: invitationId },
            data: { status: "EXPIRED" }
        });
        return (0, ApiError_1.badRequest)("This invitation has expired");
    }
    if (action === 'accept') {
        // Use transaction to ensure both operations succeed
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            // Update invitation status
            const updatedInvitation = await tx.plannerInvitation.update({
                where: { id: invitationId },
                data: { status: "ACCEPTED" }
            });
            // Add user to the event with the invited role
            const userEvent = await tx.userEvent.create({
                data: {
                    userId,
                    eventId: invitation.eventId,
                    role: invitation.role,
                    stringRole: invitation.role === weddingplanner_types_1.EventRole.OWNER ? "Owner" :
                        invitation.role === weddingplanner_types_1.EventRole.PLANNER ? "Planner" :
                            invitation.role === weddingplanner_types_1.EventRole.VENDOR ? "Vendor" : "Guest"
                }
            });
            return { invitation: updatedInvitation, userEvent };
        });
        return result;
    }
    else {
        // Reject the invitation
        const updatedInvitation = await prisma_1.prisma.plannerInvitation.update({
            where: { id: invitationId },
            data: { status: "REJECTED" }
        });
        return { invitation: updatedInvitation };
    }
});
