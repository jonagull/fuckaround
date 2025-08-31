import { type Event, type IRequestCreateEvent, type IResponseCreateEvent } from "weddingplanner-types";
import ApiClient from "./client";

const client = new ApiClient();

export const eventApi = {
  createEvent: async (event: IRequestCreateEvent): Promise<IResponseCreateEvent> => {
    const response = await client.post("/events", event);
    return response.data;
  },

  getEvents: async (): Promise<Event[]> => {
    const response = await client.get("/events");
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await client.delete(`/events/${id}`);
  },
};
