import {
  RequestCreateEvent,
  RequestUpdateEvent,
  RequestAddUserToEvent,
  ResponseEvent,
  ResponseUserEvent,
  IRequestCreateEvent,
} from "../types";
import ApiClient from "./client";

const client = new ApiClient();

export const eventApi = {
  // Create a new event
  createEvent: async (event: RequestCreateEvent | IRequestCreateEvent): Promise<ResponseEvent> => {
    // Handle legacy type field
    const requestData = 'type' in event && !('eventType' in event)
      ? { ...event, eventType: event.type, type: undefined }
      : event;
    return await client.post<ResponseEvent>("/events", requestData);
  },

  // Get all user events
  getEvents: async (): Promise<ResponseEvent[]> => {
    return await client.get<ResponseEvent[]>("/events");
  },

  // Get a specific event
  getEvent: async (id: string): Promise<ResponseEvent> => {
    return await client.get<ResponseEvent>(`/events/${id}`);
  },

  // Update an event
  updateEvent: async (id: string, event: RequestUpdateEvent): Promise<ResponseEvent> => {
    return await client.put<ResponseEvent, RequestUpdateEvent>(`/events/${id}`, event);
  },

  // Delete an event
  deleteEvent: async (id: string): Promise<void> => {
    await client.delete<void>(`/events/${id}`);
  },

  // Add user to event
  addUserToEvent: async (eventId: string, request: RequestAddUserToEvent): Promise<ResponseUserEvent> => {
    return await client.post<ResponseUserEvent, RequestAddUserToEvent>(`/events/${eventId}/users`, request);
  },

  // Remove user from event
  removeUserFromEvent: async (eventId: string, userId: string): Promise<void> => {
    await client.delete<void>(`/events/${eventId}/users/${userId}`);
  },

  // Get event users
  getEventUsers: async (eventId: string): Promise<ResponseUserEvent[]> => {
    return await client.get<ResponseUserEvent[]>(`/events/${eventId}/users`);
  },
};
