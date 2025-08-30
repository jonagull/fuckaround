import { BaseEntity } from "./types/baseEnitty";
import { Personalia } from "./common";
import { Event } from "./event";


export interface Invitation extends BaseEntity {
    eventId: Event['id'];

    guestInfo: Personalia;

    invitedAt: Date;
    acceptedAt?: Date;
    rejectedAt?: Date;

    /**
     * A number that represents how many people the guest can bring along.
     * 0 means the guest cannot bring along any additional guests.
     */
    additionalGuestsCount: number;

    /**
     * A list of guests that the guest can bring along.
     */
    additionalGuests: Personalia[];
}
