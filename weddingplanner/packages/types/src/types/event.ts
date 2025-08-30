import { BaseEntity } from "./baseEnitty";
import { Address } from "./common";
import { UserEvent } from "./userEvent";

export interface Event extends BaseEntity {


    planners: UserEvent[]
    eventDate: Date;
    venueAddress: Address;
}



