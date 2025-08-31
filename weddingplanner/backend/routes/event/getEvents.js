"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsFunction = void 0;
const prisma_1 = require("../../lib/prisma");
const types_1 = require("../../lib/types");
const ApiError_1 = require("../../lib/ApiError");
exports.getEventsFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        return (0, ApiError_1.unauthorized)("User not found");
    const userEvents = await prisma_1.prisma.userEvent.findMany({
        where: { userId },
        include: {
            event: true,
        },
    });
    const eventIds = userEvents.map((userEvent) => userEvent.eventId);
    const events = await prisma_1.prisma.event.findMany({
        where: { id: { in: eventIds } },
        include: {
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
            },
            venueAddress: true,
        },
    });
    return events.map(event => ({
        ...event,
        eventDescription: event.eventDescription,
        eventDate: event.eventDate,
        venueAddress: event.venueAddress || null,
        eventType: event.eventType,
        planners: event.planners.map(p => ({
            ...p,
            role: p.role,
            stringRole: p.stringRole,
            user: p.user
        }))
    }));
});
