import { Invitation } from "../invitation";
import { Personalia } from "../common";
import { EventRole, InvitationStatus } from "../enums";

// Request DTOs
export interface RequestSendInvitation {
  receiverEmail: string;
  role: EventRole;
  message?: string;
}

// Response DTOs
export interface ResponseInvitation {
  id: string;
  eventId: string;
  eventName: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  role: EventRole;
  status: InvitationStatus;
  message?: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}

// Legacy interfaces for backward compatibility
export interface IRequestCreateInvitation {
  eventId: string;
  guestInfo: Personalia;
  additionalGuestsCount: number;
}

export interface IResponseCreateInvitation {
  id: Invitation["id"];
}

export interface IRequestUpdateInvitation {
  acceptedAt?: Date;
  rejectedAt?: Date;
  additionalGuests?: Personalia[];
}

export interface IResponseGetInvitations {
  invitations: ResponseInvitation[];
}

export interface IResponseGetInvitation {
  invitation: ResponseInvitation;
}

export interface IRequestParseCsvGuests {
  csvFile: File;
}

export interface IResponseCsvGuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  additionalGuestsCount: number;
}
