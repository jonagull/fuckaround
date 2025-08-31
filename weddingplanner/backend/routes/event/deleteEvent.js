"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventFunction = void 0;
const ApiError_1 = require("../../lib/ApiError");
const prisma_1 = require("../../lib/prisma");
const types_1 = require("../../lib/types");
exports.deleteEventFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const { eventId } = req.params;
    const userId = req.userId;
    if (!eventId)
        return (0, ApiError_1.badRequest)("Event ID is required");
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    const event = await prisma_1.prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
        return (0, ApiError_1.notFound)("Event not found");
    // Check if the user is the owner of the event
    const userEvent = await prisma_1.prisma.userEvent.findUnique({
        where: {
            userId_eventId: { userId, eventId }
        }
    });
    if (!userEvent)
        return (0, ApiError_1.unauthorized)("User is not associated with this event");
    if (userEvent.role !== "OWNER")
        return (0, ApiError_1.unauthorized)("Only event owners can delete events");
    await prisma_1.prisma.event.delete({ where: { id: eventId } });
    return { message: "Event deleted successfully" };
});
