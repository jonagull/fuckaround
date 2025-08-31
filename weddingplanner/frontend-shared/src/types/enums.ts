// These enums match the C# backend enum values (which are 0-indexed)
export enum EventRole {
  OWNER = 0,
  PLANNER = 1,
  VENDOR = 2,
  GUEST = 3,
}

export enum InvitationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  EXPIRED = 3,
}

export enum EventType {
  WEDDING = 0,
  BIRTHDAY = 1,
  CORPORATE = 2,
  OTHER = 3,
}