import { IRequestSendPlannerInvitation, IResponseSendPlannerInvitation, EventRole } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { badRequest, forbidden, notFound, unauthorized } from "../../lib/ApiError";
import { canInviteToRole } from "../../lib/roleHierarchy";

export const sendPlannerInvitation = asyncHandler<IRequestSendPlannerInvitation, IResponseSendPlannerInvitation>(
  201,
  async (req: AuthenticatedRequest<IRequestSendPlannerInvitation>) => {
    const { eventId, receiverEmail, role, message } = req.body;
    const senderId = req.userId;

    if (!senderId) return unauthorized("User ID not found");
    if (!role) return badRequest("Role is required");

    // Check sender's role in the event
    const senderEventRole = await prisma.userEvent.findFirst({
      where: {
        eventId,
        userId: senderId
      }
    });

    if (!senderEventRole) {
      return forbidden("You don't have permission to invite users to this event");
    }

    // Validate role hierarchy
    if (!canInviteToRole(senderEventRole.role, role)) {
      return forbidden(`You cannot invite users as ${role}. Your role (${senderEventRole.role}) can only invite to roles at or below your level.`);
    }

    // Find receiver by email
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail }
    });

    if (!receiver) {
      return notFound("User not found with this email");
    }

    if (receiver.id === senderId) {
      return badRequest("You cannot invite yourself");
    }

    // Check if receiver is already part of the event
    const existingRole = await prisma.userEvent.findFirst({
      where: {
        eventId,
        userId: receiver.id
      }
    });

    if (existingRole) {
      return badRequest("User is already part of this event");
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.plannerInvitation.findUnique({
      where: {
        eventId_receiverId: {
          eventId,
          receiverId: receiver.id
        }
      }
    });

    if (existingInvitation && existingInvitation.status === "PENDING") {
      return badRequest("An invitation is already pending for this user");
    }

    // Create or update invitation
    const invitation = await prisma.plannerInvitation.upsert({
      where: {
        eventId_receiverId: {
          eventId,
          receiverId: receiver.id
        }
      },
      update: {
        status: "PENDING",
        senderId,
        role: role as EventRole,
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      create: {
        eventId,
        senderId,
        receiverId: receiver.id,
        role: role as EventRole,
        message,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      include: {
        event: {
          select: {
            id: true,
            eventName: true,
            eventDescription: true,
            eventType: true,
            eventDate: true
          }
        },
        sender: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return {
      invitation
    };
  }
);
