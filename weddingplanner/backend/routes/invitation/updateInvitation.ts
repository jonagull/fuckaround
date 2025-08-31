import { IRequestUpdateInvitation, Invitation, Personalia } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { badRequest, notFound } from "../../lib/ApiError";

interface UpdateInvitationParams {
  invitationId: string;
}

export const updateInvitationFunction = asyncHandler<IRequestUpdateInvitation, Invitation, UpdateInvitationParams>(
  200,
  async (req: AuthenticatedRequest<IRequestUpdateInvitation, UpdateInvitationParams>) => {
    const { invitationId } = req.params;
    const { acceptedAt, rejectedAt, additionalGuests } = req.body;

    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } });

    if (!invitation) return notFound("Invitation not found");

    if (acceptedAt && rejectedAt) return badRequest("Cannot both accept and reject an invitation");

    if (additionalGuests && additionalGuests.length > invitation.additionalGuestsCount) return badRequest(`Cannot add more than ${invitation.additionalGuestsCount} additional guests`);

    const updatedInvitation = await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        acceptedAt: acceptedAt ? new Date(acceptedAt) : invitation.acceptedAt,
        rejectedAt: rejectedAt ? new Date(rejectedAt) : invitation.rejectedAt,
        additionalGuests: additionalGuests ? JSON.parse(JSON.stringify(additionalGuests)) : undefined,
      },
    });

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
      additionalGuests: (updatedInvitation.additionalGuests as unknown) as Personalia[],
      createdAt: updatedInvitation.createdAt,
      updatedAt: updatedInvitation.updatedAt,
    };
  }
);
