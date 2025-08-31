import type { BaseEntity } from "./baseEntity";
import type { Address, Nullable } from "./common";
import type { UserEventWithUser } from "./userEvent";
import type { EventType } from "./enums";
import type { ResponseEvent } from "./requests/createEvent";

// Legacy Event interface - now just an alias for ResponseEvent
export type Event = ResponseEvent;

// Old interface for reference (deprecated)
export interface LegacyEvent extends BaseEntity {
  eventName: string;
  eventDescription: Nullable<string>;
  eventType: EventType;
  planners: UserEventWithUser[];
  eventDate: Nullable<Date | string>;
  venueAddress: Nullable<Address>;
}