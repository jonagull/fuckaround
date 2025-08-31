import { EventRole, IRequestCreateEvent, IResponseCreateEvent } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { ApiError, badRequest, notFound, unauthorized } from "../../lib/ApiError";

export const createEventFunction = asyncHandler<IRequestCreateEvent, IResponseCreateEvent>(201, async (req: AuthenticatedRequest<IRequestCreateEvent>) => {

  const { eventName, type, eventDescription, eventDate, venueAddress } = req.body;

  const userId = req.userId;

  if (!userId) return unauthorized("User ID not found");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
    },
  });

  if (!user) return notFound("User not found");

  // Create event and user-event relationship in a single transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the event
    const event = await tx.event.create({
      data: {
        eventName,
        eventType: type,
        eventDescription,
        eventDate,
        venueAddress: venueAddress ? {
          create: venueAddress
        } : undefined
      }
    });

    // Create the UserEvent relationship
    await tx.userEvent.create({
      data: {
        userId,
        eventId: event.id,
        role: EventRole.OWNER,
        stringRole: "",
      },
    });

    // Return the event with related data
    return await tx.event.findUnique({
      where: { id: event.id },
      include: {
        planners: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        venueAddress: true
      }
    });
  });

  console.log(result);

  if (!result?.id) return badRequest("Internal error");

  return { id: result.id };

});
