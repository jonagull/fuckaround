"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventFunction = void 0;
const weddingplanner_types_1 = require("weddingplanner-types");
const types_1 = require("../../lib/types");
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = require("../../lib/ApiError");
exports.createEventFunction = (0, types_1.asyncHandler)(201, async (req) => {
    const { eventName, type, eventDescription, eventDate, venueAddress } = req.body;
    const userId = req.userId;
    if (!userId)
        return (0, ApiError_1.unauthorized)("User ID not found");
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
        },
    });
    if (!user)
        return (0, ApiError_1.notFound)("User not found");
    // Create event and user-event relationship in a single transaction
    const result = await prisma_1.prisma.$transaction(async (tx) => {
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
                role: weddingplanner_types_1.EventRole.OWNER,
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
    if (!result?.id)
        return (0, ApiError_1.badRequest)("Internal error");
    return { id: result.id };
});
