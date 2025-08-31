// Request DTOs
export interface RequestSearchAddress {
  query: string;
  country?: string; // Default "NO" for Norway
  limit?: number; // Default 10
}

// Response DTOs
export interface ResponseAddressSearch {
  placeId: string;
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  placeType: string;
}

// Legacy interfaces for backward compatibility
export interface PlaceAutocompleteResponse {
  predictions: Array<{
    place_id: string;
    description: string;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
  }>;
  status: string;
}

export interface PlaceDetailsResponse {
  result: {
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  };
  status: string;
}

export interface AddressSearchQuery {
  query: string;
}

export interface PlaceDetails {
  latitude: number;
  longitude: number;
  streetNumber: string;
  postalCode: string;
  city: string;
  state: string;
  district: string;
}