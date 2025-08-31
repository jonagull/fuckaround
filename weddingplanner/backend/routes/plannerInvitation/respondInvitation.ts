import { EventRole, IResponseRespondPlannerInvitation } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { badRequest, forbidden, notFound, unauthorized } from "../../lib/ApiError";

interface RespondParams {
  invitationId: string;
  action: 'accept' | 'reject';
}

export const respondPlannerInvitation = asyncHandler<void, IResponseRespondPlannerInvitation, RespondParams>(
  200,
  async (req: AuthenticatedRequest<void, RespondParams>) => {
    const userId = req.userId;
    const { invitationId, action } = req.params;

    if (!userId) return unauthorized("User ID not found");

    const invitation = await prisma.plannerInvitation.findUnique({
      where: { id: invitationId },
      include: {
        event: true
      }
    });

    if (!invitation) return notFound("Invitation not found");
    if (invitation.receiverId !== userId) return forbidden("You can only respond to your own invitations");
    if (invitation.status !== "PENDING") return badRequest(`This invitation has already been ${invitation.status.toLowerCase()}`);


    if (new Date(invitation.expiresAt) < new Date()) {
      await prisma.plannerInvitation.update({
        where: { id: invitationId },
        data: { status: "EXPIRED" }
      });
      return badRequest("This invitation has expired");
    }

    if (action === 'accept') {
      const result = await prisma.$transaction(async (tx) => {
        const updatedInvitation = await tx.plannerInvitation.update({
          where: { id: invitationId },
          data: { status: "ACCEPTED" }
        });

        const userEvent = await tx.userEvent.create({
          data: {
            userId,
            eventId: invitation.eventId,
            role: invitation.role,
            stringRole: invitation.role === EventRole.OWNER ? "Owner" :
              invitation.role === EventRole.PLANNER ? "Planner" :
                invitation.role === EventRole.VENDOR ? "Vendor" : "Guest"
          }
        });

        return { invitation: updatedInvitation, userEvent };
      });

      return result;
    } else {
      const updatedInvitation = await prisma.plannerInvitation.update({
        where: { id: invitationId },
        data: { status: "REJECTED" }
      });

      return { invitation: updatedInvitation };
    }
  }
);
