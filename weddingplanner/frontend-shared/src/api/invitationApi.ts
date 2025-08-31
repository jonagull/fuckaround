import {
  RequestSendInvitation,
  ResponseInvitation,
  type Invitation,
  type IRequestCreateInvitation,
  type IResponseCreateInvitation,
  type IRequestUpdateInvitation
} from "../types";
import ApiClient from "./client";

const client = new ApiClient();

export const invitationApi = {
  // Send an invitation for an event
  sendInvitation: async (eventId: string, invitation: RequestSendInvitation): Promise<ResponseInvitation> => {
    return await client.post<ResponseInvitation, RequestSendInvitation>(`/invitations/event/${eventId}`, invitation);
  },

  // Accept an invitation
  acceptInvitation: async (invitationId: string): Promise<ResponseInvitation> => {
    return await client.post<ResponseInvitation>(`/invitations/${invitationId}/accept`);
  },

  // Reject an invitation
  rejectInvitation: async (invitationId: string): Promise<ResponseInvitation> => {
    return await client.post<ResponseInvitation>(`/invitations/${invitationId}/reject`);
  },

  // Get my invitations (as receiver)
  getMyInvitations: async (): Promise<ResponseInvitation[]> => {
    return await client.get<ResponseInvitation[]>("/invitations");
  },

  // Get invitations for an event (as event owner/planner)
  getEventInvitations: async (eventId: string): Promise<ResponseInvitation[]> => {
    return await client.get<ResponseInvitation[]>(`/invitations/event/${eventId}`);
  },

  // Cancel an invitation
  cancelInvitation: async (invitationId: string): Promise<void> => {
    await client.delete(`/invitations/${invitationId}`);
  },

  // Get available roles
  getAvailableRoles: async (): Promise<{ roles: string[] }> => {
    return await client.get<{ roles: string[] }>("/invitations/available-roles");
  },

  // Legacy methods for backward compatibility
  createInvitation: async (invitation: IRequestCreateInvitation): Promise<IResponseCreateInvitation> => {
    return await client.post<IResponseCreateInvitation, IRequestCreateInvitation>("/guest-invitations", invitation);
  },

  getInvitations: async (eventId: string): Promise<ResponseInvitation[]> => {
    return await client.get<ResponseInvitation[]>(`/guest-invitations/event/${eventId}`);
  },

  updateInvitation: async (invitationId: string, data: IRequestUpdateInvitation): Promise<Invitation> => {
    return await client.patch<Invitation, IRequestUpdateInvitation>(`/guest-invitations/${invitationId}`, data);
  },

  deleteInvitation: async (invitationId: string): Promise<void> => {
    await client.delete(`/guest-invitations/${invitationId}`);
  },
};
