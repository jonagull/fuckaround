import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api";
import { Event, type IRequestCreateEvent } from "../types";
import { RequestUpdateEvent } from "../types/requests/updateEvent";


export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: IRequestCreateEvent) => eventApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};


export const useGetEvents = () => useQuery({
  queryKey: ["events"],
  queryFn: () => eventApi.getEvents(),
});

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetEvent = (id: string) => useQuery({
  queryKey: ["event", id],
  queryFn: () => eventApi.getEvent(id),
});



export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }: { id: Event["id"]; event: RequestUpdateEvent }) => eventApi.updateEvent(id, event),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    onError: (error) => console.error(error)
  });
};
