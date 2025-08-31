import { 
  type Invitation, 
  type IRequestCreateInvitation, 
  type IResponseCreateInvitation,
  type IRequestUpdateInvitation 
} from "weddingplanner-types";
import ApiClient from "./client";

const client = new ApiClient();

export const invitationApi = {
  createInvitation: async (invitation: IRequestCreateInvitation): Promise<IResponseCreateInvitation> => {
    const response = await client.post("/guest-invitations", invitation);
    return response.data;
  },

  getInvitations: async (eventId: string): Promise<Invitation[]> => {
    const response = await client.get(`/guest-invitations/event/${eventId}`);
    return response.data;
  },

  updateInvitation: async (invitationId: string, data: IRequestUpdateInvitation): Promise<Invitation> => {
    const response = await client.patch(`/guest-invitations/${invitationId}`, data);
    return response.data;
  },

  deleteInvitation: async (invitationId: string): Promise<void> => {
    await client.delete(`/guest-invitations/${invitationId}`);
  },
};