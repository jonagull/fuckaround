import type { BaseEntity } from "./baseEntity";
import type { Address, Nullable } from "./common";
import type { UserEventWithUser } from "./userEvent";
import type { EventType } from "./enums";

export interface Event extends BaseEntity {
  eventName: string;
  eventDescription: Nullable<string>;
  eventType: EventType;
  planners: UserEventWithUser[];
  eventDate: Nullable<Date | string>;
  venueAddress: Nullable<Address>;
}
