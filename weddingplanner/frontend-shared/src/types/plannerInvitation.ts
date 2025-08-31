import { BaseEntity } from "./baseEntity";
import { EventRole } from "./enums";

export interface PlannerInvitation extends BaseEntity {
  eventId: string;
  senderId: string;
  receiverId: string;
  role: EventRole | string; // Role being invited to
  status: string; // Will be one of the InvitationStatus values from Prisma
  message?: string | null;
  expiresAt: Date | string;
}

export interface PlannerInvitationWithRelations extends PlannerInvitation {
  event: {
    id: string;
    eventName: string;
    eventDescription?: string | null;
    eventType: string;
    eventDate?: Date | string | null;
  };
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreatePlannerInvitationRequest {
  eventId: string;
  receiverEmail: string;
  role: EventRole | string;
  message?: string;
}

export interface PlannerInvitationResponse {
  status: 'accept' | 'reject';
}