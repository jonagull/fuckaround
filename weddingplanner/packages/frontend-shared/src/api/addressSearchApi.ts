import { type Address } from "weddingplanner-types";
import ApiClient from "./client";

const client = new ApiClient();

export const addressSearchApi = {
  searchAddresses: async (query: string): Promise<Address[]> => {
    const response = await client.get<Address[]>(`/addressSearch/?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
