import { EventRole, IRequestCreateInvitation, IResponseCreateInvitation } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { badRequest, forbidden, notFound } from "../../lib/ApiError";

export const createInvitationFunction = asyncHandler<IRequestCreateInvitation, IResponseCreateInvitation>(
  201,
  async (req: AuthenticatedRequest<IRequestCreateInvitation>) => {
    const { eventId, guestInfo, additionalGuestsCount } = req.body;
    const userId = req.userId;

    if (!userId) return badRequest("User ID not found");

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
    if (userEvent.role !== EventRole.OWNER && userEvent.role !== EventRole.PLANNER) return forbidden("Only event owners and planners can send invitations");

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) return notFound("Event not found");

    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        eventId_guestEmail: {
          eventId,
          guestEmail: guestInfo.email,
        },
      },
    });

    if (existingInvitation) return badRequest("An invitation already exists for this guest");

    const invitation = await prisma.invitation.create({
      data: {
        eventId,
        guestFirstName: guestInfo.firstName,
        guestLastName: guestInfo.lastName,
        guestEmail: guestInfo.email,
        guestPhoneNumber: guestInfo.phoneNumber,
        guestPhoneCountryCode: guestInfo.phoneCountryCode,
        additionalGuestsCount: additionalGuestsCount || 0,
        additionalGuests: [],
      },
    });

    return { id: invitation.id };
  }
);
