import { BaseEntity } from "./baseEnitty";

export interface Guest extends BaseEntity {
    name: string;
    email: string;
    phone?: string;
    weddingId: string;
    rsvpStatus: "pending" | "confirmed" | "declined";
    dietaryRestrictions?: string;
    allowPlusOne: boolean;
    plusOneName?: string;
}

export interface CreateGuestRequest {
    name: string;
    email: string;
    phone?: string;
    allowPlusOne: boolean;
    dietaryRestrictions?: string;
}

export interface UpdateGuestRequest extends Partial<CreateGuestRequest> {
    rsvpStatus?: "pending" | "confirmed" | "declined";
    plusOneName?: string;
}

export interface GuestResponse extends Guest {}

export interface GuestListResponse {
    guests: Guest[];
    total: number;
}
