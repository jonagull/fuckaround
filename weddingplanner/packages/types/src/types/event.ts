import { BaseEntity } from "./baseEntity";
import { Address } from "./common";
import { UserEvent } from "./userEvent";
import { EventType } from "./enums";

export interface Event extends BaseEntity {
  eventName: string;
  eventDescription: string;
  eventType: EventType;

  planners: UserEvent[];
  eventDate: Date;
  venueAddress: Address;
}
