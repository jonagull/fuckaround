import {
  IRequestSendPlannerInvitation,
  IResponseSendPlannerInvitation,
  IResponseListPlannerInvitations,
  IResponseRespondPlannerInvitation
} from "../types";
import ApiClient from "./client";

const client = new ApiClient();

export const plannerInvitationApi = {
  send: async (data: IRequestSendPlannerInvitation): Promise<IResponseSendPlannerInvitation> => {
    return await client.post<IResponseSendPlannerInvitation, IRequestSendPlannerInvitation>("/invitations/send", data);
  },

  list: async (): Promise<IResponseListPlannerInvitations> => {
    return await client.get<IResponseListPlannerInvitations>("/invitations/list");
  },

  accept: async (invitationId: string): Promise<IResponseRespondPlannerInvitation> => {
    return await client.post<IResponseRespondPlannerInvitation>(`/invitations/${invitationId}/accept`);
  },

  reject: async (invitationId: string): Promise<IResponseRespondPlannerInvitation> => {
    return await client.post<IResponseRespondPlannerInvitation>(`/invitations/${invitationId}/reject`);
  },
};
