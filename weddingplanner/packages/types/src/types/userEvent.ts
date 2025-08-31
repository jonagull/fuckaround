import { BaseEntity } from "./baseEntity";
import { Event } from "./event";
import { User } from "./user";
import { EventRole } from "./enums";
import { StringRole } from "./common";

export interface UserEvent extends BaseEntity {
  eventId: Event["id"];
  userId: User["id"];
  role: EventRole;

  stringRole: StringRole;
}
