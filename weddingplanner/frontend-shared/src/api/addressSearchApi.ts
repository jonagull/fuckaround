import {
  RequestSearchAddress,
  ResponseAddressSearch,
} from "../types";
import ApiClient from "./client";

const client = new ApiClient();

export const addressSearchApi = {
  searchAddress: async (request: RequestSearchAddress): Promise<ResponseAddressSearch[]> => {
    return await client.post<ResponseAddressSearch[], RequestSearchAddress>("/address-search/search", request);
  },

  getAddressDetails: async (placeId: string): Promise<ResponseAddressSearch> => {
    return await client.get<ResponseAddressSearch>(`/address-search/${placeId}`);
  },

  searchAddresses: async (query: string): Promise<ResponseAddressSearch[]> => {
    return addressSearchApi.searchAddress({ query, limit: 10 });
  },
};
