import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "../api";
import {
  type IRequestCreateInvitation,
  type IRequestUpdateInvitation,
  type GuestInvitation,
  type SendInvitationsResponse,
  type AdditionalGuestInput,
  IRequestParseCsvGuests,
} from "../types";

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitation: IRequestCreateInvitation) =>
      invitationApi.createInvitation(invitation),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", variables.eventId] });
    },
    onError: (error) => {
      console.error("Error creating invitation:", error);
    },
  });
};

export const useGetInvitations = (eventId: string) =>
  useQuery<GuestInvitation[], Error>({
    queryKey: ["invitations", eventId],
    queryFn: () => invitationApi.getInvitations(eventId),
    enabled: !!eventId,
  });

export const useUpdateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      invitationId,
      data,
    }: {
      invitationId: string;
      data: IRequestUpdateInvitation;
    }) => invitationApi.updateInvitation(invitationId, data),
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

export const useSendGuestInvitations = () => {
  const queryClient = useQueryClient();
  return useMutation<SendInvitationsResponse, Error, { invitationIds: string[]; eventId: string }>({
    mutationFn: ({ invitationIds }) => invitationApi.sendGuestInvitations(invitationIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", variables.eventId] });
    },
    onError: (error) => {
      console.error("Error sending invitations:", error);
    },
  });
};

export const useGetGuestInvitation = (invitationId: string) =>
  useQuery<GuestInvitation, Error>({
    queryKey: ["guest-invitation", invitationId],
    queryFn: () => invitationApi.getGuestInvitation(invitationId),
    enabled: !!invitationId,
    retry: false,
  });

export const useAcceptGuestInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    GuestInvitation,
    Error,
    { invitationId: string; additionalGuests?: AdditionalGuestInput[] }
  >({
    mutationFn: ({ invitationId, additionalGuests }) =>
      invitationApi.acceptGuestInvitation(invitationId, additionalGuests),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guest-invitation", variables.invitationId] });
    },
  });
};

export const useDeclineGuestInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<GuestInvitation, Error, string>({
    mutationFn: (invitationId) => invitationApi.declineGuestInvitation(invitationId),
    onSuccess: (_, invitationId) => {
      queryClient.invalidateQueries({ queryKey: ["guest-invitation", invitationId] });
    },
  });
};

export const useParseCsvGuests = () => {
  return useMutation({
    mutationFn: (data: IRequestParseCsvGuests) => invitationApi.parseCsvGuests(data),
    onError: (error) => {
      console.error("Error parsing CSV guests:", error);
    },
  });
};

export const useBulkCreateInvitations = () => {
  return useMutation({
    mutationFn: (data: IRequestCreateInvitation[]) => invitationApi.bulkCreateInvitations(data),
    onError: (error) => {
      console.error("Error bulk creating invitations:", error);
    },
  });
};
