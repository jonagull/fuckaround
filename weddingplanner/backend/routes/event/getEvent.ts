import { EmptyBody, Event, EventRole, EventType } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { badRequest, notFound, unauthorized } from "../../lib/ApiError";
import { prisma } from "../../lib/prisma";

interface GetEventParams {
  eventId: string;
}

export const getEventFunction = asyncHandler<EmptyBody, Event, GetEventParams>(200, async (req: AuthenticatedRequest<EmptyBody, GetEventParams>) => {
  const { eventId } = req.params;
  const userId = req.userId;

  if (!eventId) return badRequest("Event ID is required");
  if (!userId) return unauthorized("User ID not found");

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      venueAddress: true,
      planners: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!event) return notFound("Event not found");

  console.warn(event);


  const eventResponse: Event = {
    ...event,
    eventType: event.eventType as EventType,
    venueAddress: event.venueAddress || null,
    planners: event.planners.map(p => ({
      ...p,
      role: p.role as EventRole,
      stringRole: p.stringRole as "Bride" | "Groom" | "Birthday Boi",
      user: p.user
    }))
  }

  return eventResponse;
});
