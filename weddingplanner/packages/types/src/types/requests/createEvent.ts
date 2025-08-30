import { Address, Nullable } from "../common";
import { EventType } from "../enums";
import { Event } from "../event";

export interface IRequestCreateEvent {
  eventName: string;
  type: EventType;

  eventDescription?: Nullable<string>;

  eventDate: Nullable<Date>;
  venueAddress: Nullable<Address>;
}

export interface IResponseCreateEvent {
  id: Event["id"];
}
