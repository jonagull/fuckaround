"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableRoles = void 0;
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
const roleHierarchy_1 = require("../../lib/roleHierarchy");
exports.getAvailableRoles = (0, types_1.asyncHandler)(200, async (req) => {
    const { eventId } = req.params;
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    if (!eventId)
        return (0, ApiError_1.badRequest)("Event ID is required");
    // Get user's role in the event
    const userEventRole = await prisma_1.prisma.userEvent.findFirst({
        where: {
            eventId,
            userId
        }
    });
    if (!userEventRole) {
        // User is not part of the event, return empty roles
        return {
            userRole: "NONE",
            availableRoles: []
        };
    }
    const availableRoles = (0, roleHierarchy_1.getAvailableRolesToInvite)(userEventRole.role);
    return {
        userRole: userEventRole.role,
        availableRoles
    };
});
