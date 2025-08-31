import { Invitation, Personalia } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { forbidden } from "../../lib/ApiError";

interface GetInvitationsParams {
  eventId: string;
}

export const getInvitationsFunction = asyncHandler<never, Invitation[], GetInvitationsParams>(
  200,
  async (req: AuthenticatedRequest<never, GetInvitationsParams>) => {
    const { eventId } = req.params;
    const userId = req.userId;

    if (!userId) return forbidden("User ID not found");

    const userEvent = await prisma.userEvent.findUnique({
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

    if (!userEvent) return forbidden("You don't have access to this event");

    const invitations = await prisma.invitation.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

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
      additionalGuests: (inv.additionalGuests as unknown) as Personalia[],
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt,
    }));
  }
);
