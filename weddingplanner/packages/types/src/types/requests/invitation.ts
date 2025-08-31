import { Invitation } from "../invitation";
import { Personalia } from "../common";

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
  invitations: Invitation[];
}

export interface IResponseGetInvitation {
  invitation: Invitation;
}