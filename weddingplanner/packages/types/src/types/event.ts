import type { BaseEntity } from "./baseEntity";
import type { Address, Nullable } from "./common";
import type { UserEvent } from "./userEvent";
import type { EventType } from "./enums";

export interface Event extends BaseEntity {
  eventName: string;
  eventDescription: Nullable<string>;
  eventType: EventType;

  planners: UserEvent[];
  eventDate: Nullable<Date>;
  venueAddress: Nullable<Address>;
}
