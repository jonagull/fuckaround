"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvitationFunction = void 0;
const weddingplanner_types_1 = require("weddingplanner-types");
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.deleteInvitationFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const { invitationId } = req.params;
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.forbidden)("User ID not found");
    // Get the invitation to check event access
    const invitation = await prisma_1.prisma.invitation.findUnique({
        where: { id: invitationId },
        select: {
            eventId: true,
        },
    });
    if (!invitation) {
        return (0, ApiError_1.notFound)("Invitation not found");
    }
    // Check if user has permission to delete invitations (must be OWNER or PLANNER)
    const userEvent = await prisma_1.prisma.userEvent.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId: invitation.eventId,
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
        return (0, ApiError_1.forbidden)("Only event owners and planners can delete invitations");
    }
    // Delete the invitation
    await prisma_1.prisma.invitation.delete({
        where: { id: invitationId },
    });
    return { success: true };
});
