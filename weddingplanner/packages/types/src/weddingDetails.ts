import { BaseEntity } from "./baseEnitty";

export interface WeddingDetails extends BaseEntity {
    userId: string;
    partnerOneName: string;
    partnerTwoName: string;
    weddingDate: string;
    venue: string;
    guestEstimate: number;
}
