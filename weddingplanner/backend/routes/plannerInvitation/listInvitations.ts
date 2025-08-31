import { IRequestListPlannerInvitations, IResponseListPlannerInvitations } from "weddingplanner-types";
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import { prisma } from "../../lib/prisma";
import { unauthorized } from "../../lib/ApiError";

export const listPlannerInvitations = asyncHandler<IRequestListPlannerInvitations, IResponseListPlannerInvitations>(
  200,
  async (req: AuthenticatedRequest<IRequestListPlannerInvitations>) => {
    const userId = req.userId;

    if (!userId) return unauthorized("User ID not found");

    // Get invitations sent by the user
    const sent = await prisma.plannerInvitation.findMany({
      where: {
        senderId: userId,
        status: "PENDING"
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get invitations received by the user
    const received = await prisma.plannerInvitation.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
        expiresAt: {
          gt: new Date() // Only show non-expired invitations
        }
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { sent, received };
  }
);
