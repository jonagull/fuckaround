import { EventRole } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { forbidden, notFound } from "../../lib/ApiError";

interface DeleteInvitationParams {
  invitationId: string;
}

export const deleteInvitationFunction = asyncHandler<never, { success: boolean }, DeleteInvitationParams>(
  200,
  async (req: AuthenticatedRequest<never, DeleteInvitationParams>) => {
    const { invitationId } = req.params;
    const userId = req.userId;

    if (!userId) return forbidden("User ID not found");

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      select: {
        eventId: true,
      },
    });

    if (!invitation) return notFound("Invitation not found");

    const userEvent = await prisma.userEvent.findUnique({
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

    if (!userEvent) return forbidden("You don't have access to this event");

    if (userEvent.role !== EventRole.OWNER && userEvent.role !== EventRole.PLANNER) return forbidden("Only event owners and planners can delete invitations");

    await prisma.invitation.delete({
      where: { id: invitationId },
    });

    return { success: true };
  }
);
