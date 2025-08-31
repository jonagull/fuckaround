import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "../api";
import { type IRequestCreateInvitation, type IRequestUpdateInvitation } from "../types";

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitation: IRequestCreateInvitation) => invitationApi.createInvitation(invitation),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", variables.eventId] });
    },
    onError: (error) => {
      console.error("Error creating invitation:", error);
    },
  });
};

export const useGetInvitations = (eventId: string) => useQuery({
  queryKey: ["invitations", eventId],
  queryFn: () => invitationApi.getInvitations(eventId),
  enabled: !!eventId,
});

export const useUpdateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invitationId, data }: { invitationId: string; data: IRequestUpdateInvitation }) => 
      invitationApi.updateInvitation(invitationId, data),
    onSuccess: (updatedInvitation) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", updatedInvitation.eventId] });
    },
    onError: (error) => {
      console.error("Error updating invitation:", error);
    },
  });
};

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invitationId, eventId }: { invitationId: string; eventId: string }) => 
      invitationApi.deleteInvitation(invitationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", variables.eventId] });
    },
    onError: (error) => {
      console.error("Error deleting invitation:", error);
    },
  });
};