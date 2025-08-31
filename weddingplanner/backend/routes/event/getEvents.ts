import type { EmptyBody, Event, EventRole, EventType } from "weddingplanner-types";
import { prisma } from "../../lib/prisma";
import { asyncHandler, type AuthenticatedRequest } from "../../lib/types";
import { unauthorized } from "../../lib/ApiError";

export const getEventsFunction = asyncHandler<EmptyBody, Event[]>(200, async (req: AuthenticatedRequest<EmptyBody>) => {
  const userId = req.userId;

  if (!userId) return unauthorized("User ID not found");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return unauthorized("User not found");

  const userEvents = await prisma.userEvent.findMany({
    where: { userId },
    include: {
      event: true,
    },
  });

  const eventIds = userEvents.map((userEvent) => userEvent.eventId);

  const events = await prisma.event.findMany({
    where: { id: { in: eventIds } },
    include: {
      planners: true,
      venueAddress: true,
    },
  });

  return events.map(event => ({
    ...event,
    eventDescription: event.eventDescription || '',
    eventDate: event.eventDate || new Date(),
    venueAddress: event.venueAddress || null,
    eventType: event.eventType as EventType,
    planners: userEvents.map(userEvent => ({
      ...userEvent,
      role: userEvent.role as EventRole,
      stringRole: userEvent.stringRole as string as "Bride" | "Groom" | "Birthday Boi",
    }))
  } satisfies Event))
});
