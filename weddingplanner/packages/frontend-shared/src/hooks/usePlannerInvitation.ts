import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { plannerInvitationApi } from "../api/plannerInvitation";
import { IRequestSendPlannerInvitation } from "weddingplanner-types";

export const useSendPlannerInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: IRequestSendPlannerInvitation) => plannerInvitationApi.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plannerInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const usePlannerInvitations = () => {
  return useQuery({
    queryKey: ["plannerInvitations"],
    queryFn: plannerInvitationApi.list,
  });
};

export const useAcceptPlannerInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invitationId: string) => plannerInvitationApi.accept(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plannerInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });
};

export const useRejectPlannerInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invitationId: string) => plannerInvitationApi.reject(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plannerInvitations"] });
    },
  });
};