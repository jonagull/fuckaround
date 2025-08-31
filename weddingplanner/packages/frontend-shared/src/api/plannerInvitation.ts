import { 
  IRequestSendPlannerInvitation, 
  IResponseSendPlannerInvitation, 
  IResponseListPlannerInvitations,
  IResponseRespondPlannerInvitation
} from "weddingplanner-types";
import ApiClient from "./client";

const client = new ApiClient();

export const plannerInvitationApi = {
  send: async (data: IRequestSendPlannerInvitation): Promise<IResponseSendPlannerInvitation> => {
    const response = await client.post("/invitations/send", data);
    return response.data;
  },

  list: async (): Promise<IResponseListPlannerInvitations> => {
    const response = await client.get("/invitations/list");
    return response.data;
  },

  accept: async (invitationId: string): Promise<IResponseRespondPlannerInvitation> => {
    const response = await client.post(`/invitations/${invitationId}/accept`);
    return response.data;
  },

  reject: async (invitationId: string): Promise<IResponseRespondPlannerInvitation> => {
    const response = await client.post(`/invitations/${invitationId}/reject`);
    return response.data;
  },
};