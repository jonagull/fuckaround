import { Address, Nullable } from "../common";
import { EventType, EventRole } from "../enums";

// Request DTOs
export interface RequestCreateEvent {
  eventName: string;
  eventDescription?: string;
  eventType: EventType;
  eventDate?: Date | string;
  venueAddress?: RequestAddress;
}

export interface RequestAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  placeId: string;
}


export interface RequestAddUserToEvent {
  email: string;
  role: EventRole;
}

// Response DTOs
export interface ResponseEvent {
  id: string;
  eventName: string;
  eventDescription?: string;
  eventType: EventType;
  eventDate?: Date | string;
  venueAddress?: ResponseAddress;
  createdAt: Date | string;
  updatedAt: Date | string;
  planners: ResponseUserEvent[];
}

export interface ResponseAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

export interface ResponseUserEvent {
  userId: string;
  userName: string;
  userEmail: string;
  role: EventRole;
}

// Legacy interfaces for backward compatibility
export interface IRequestCreateEvent {
  eventName: string;
  type: EventType;  // Frontend uses 'type' instead of 'eventType'
  eventDescription?: Nullable<string>;
  eventDate: Nullable<Date | string>;
  venueAddress: Nullable<Address>;
}

export interface IResponseCreateEvent extends ResponseEvent { }
