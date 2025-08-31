"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventFunction = void 0;
const types_1 = require("../../lib/types");
const ApiError_1 = require("../../lib/ApiError");
const prisma_1 = require("../../lib/prisma");
exports.getEventFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const { eventId } = req.params;
    const userId = req.userId;
    if (!eventId)
        return (0, ApiError_1.badRequest)("Event ID is required");
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    const event = await prisma_1.prisma.event.findUnique({ where: { id: eventId }, include: { venueAddress: true, planners: true } });
    if (!event)
        return (0, ApiError_1.notFound)("Event not found");
    console.warn(event);
    return {
        ...event,
        eventType: event.eventType,
        venueAddress: event.venueAddress || null,
        planners: event.planners,
    };
});
