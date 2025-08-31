export interface GuestInvitation {
  id: string;
  eventId: string;
  eventName: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  guestPhoneCountryCode: string;
  invitedAt: string;
  emailSentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  additionalGuestsCount: number;
  additionalGuests: AdditionalGuest[];
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface AdditionalGuest {
  firstName: string;
  lastName: string;
}

export interface AdditionalGuestInput {
  name: string;
}

export interface AcceptInvitationRequest {
  additionalGuests: AdditionalGuestInput[];
}

export interface SendInvitationsResponse {
  totalRequested: number;
  successfullySent: number;
  failed: number;
  results: InvitationSendResult[];
}

export interface InvitationSendResult {
  invitationId: string;
  success: boolean;
  errorMessage?: string;
  invitationUrl?: string;
}