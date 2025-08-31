import { RequestAddress } from "./createEvent";

export interface RequestUpdateEvent {
  eventName?: string;
  eventDescription?: string;
  eventDate?: Date | string;
  venueAddress?: RequestAddress;
}
