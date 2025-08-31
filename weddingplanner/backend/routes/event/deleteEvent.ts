import { badRequest, notFound, unauthorized } from "../../lib/ApiError";
import { prisma } from "../../lib/prisma";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { EmptyBody } from "weddingplanner-types";

interface DeleteEventParams {
  eventId: string;
}

export const deleteEventFunction = asyncHandler<EmptyBody, EmptyBody, DeleteEventParams>(200, async (req: AuthenticatedRequest<EmptyBody>) => {
  const { eventId } = req.params as DeleteEventParams;
  const userId = req.userId;

  if (!eventId) return badRequest("Event ID is required");
  if (!userId) return unauthorized("User ID not found");

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Event not found");

  // Check if the user is the owner of the event
  const userEvent = await prisma.userEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId }
    }
  });

  if (!userEvent) return unauthorized("User is not associated with this event");
  if (userEvent.role !== "OWNER") return unauthorized("Only event owners can delete events");

  await prisma.event.delete({ where: { id: eventId } });

  return { message: "Event deleted successfully" };
});
