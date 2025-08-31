import { EventRole } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { badRequest, unauthorized } from "../../lib/ApiError";
import { getAvailableRolesToInvite } from "../../lib/roleHierarchy";

interface GetAvailableRolesParams {
  eventId: string;
}

interface AvailableRolesResponse {
  userRole: EventRole | string;
  availableRoles: EventRole[];
}

export const getAvailableRoles = asyncHandler<void, AvailableRolesResponse, GetAvailableRolesParams>(
  200,
  async (req: AuthenticatedRequest<void, GetAvailableRolesParams>) => {
    const { eventId } = req.params;
    const userId = req.userId;

    if (!userId) return unauthorized("User ID not found");
    if (!eventId) return badRequest("Event ID is required");

    // Get user's role in the event
    const userEventRole = await prisma.userEvent.findFirst({
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

    const availableRoles = getAvailableRolesToInvite(userEventRole.role);

    return {
      userRole: userEventRole.role,
      availableRoles
    };
  }
);