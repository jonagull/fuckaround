import { PlannerInvitation, PlannerInvitationWithRelations } from "../plannerInvitation";
import { EventRole } from "../enums";

export interface IRequestSendPlannerInvitation {
  eventId: string;
  receiverEmail: string;
  role: EventRole | string;
  message?: string;
}

export interface IResponseSendPlannerInvitation {
  invitation: PlannerInvitationWithRelations;
}

export interface IRequestListPlannerInvitations {
  // No body, will use query params
}

export interface IResponseListPlannerInvitations {
  sent: PlannerInvitationWithRelations[];
  received: PlannerInvitationWithRelations[];
}

export interface IRequestRespondPlannerInvitation {
  // invitationId will be in params
}

export interface IResponseRespondPlannerInvitation {
  invitation: PlannerInvitation;
  userEvent?: {
    id: string;
    eventId: string;
    userId: string;
    role: string;
  };
}