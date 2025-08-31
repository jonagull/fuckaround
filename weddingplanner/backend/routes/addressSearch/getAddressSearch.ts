
import { asyncHandler, AuthenticatedRequest } from "../../lib/types";
import {
  Address,
  PlaceAutocompleteResponse,
  PlaceDetailsResponse,
  AddressSearchQuery,
  PlaceDetails,
  EmptyBody
} from "weddingplanner-types";
import { badRequest, unauthorized } from "../../lib/ApiError";
import axios from "axios";

const AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

async function getPlaceDetails(placeId: string, apiKey: string): Promise<PlaceDetails> {
  try {
    const detailsUrl = `${DETAILS_URL}?place_id=${placeId}&fields=geometry,address_components&key=${apiKey}`;
    const response = await axios.get<PlaceDetailsResponse>(detailsUrl);

    let streetNumber = "";
    let postalCode = "";
    let city = "";
    let state = "";
    let district = "";
    let latitude = 0;
    let longitude = 0;

    if (response.data.result) {
      // Get coordinates
      if (response.data.result.geometry?.location) {
        latitude = response.data.result.geometry.location.lat;
        longitude = response.data.result.geometry.location.lng;
      }

      // Get address components
      if (response.data.result.address_components) {
        for (const component of response.data.result.address_components) {
          const types = component.types;
          const longName = component.long_name;

          if (types.includes("street_number")) {
            streetNumber = longName;
          } else if (types.includes("postal_code")) {
            postalCode = longName;
          } else if (types.includes("locality")) {
            city = longName;
          } else if (types.includes("sublocality_level_1")) {
            district = longName;
          } else if (types.includes("sublocality") && !city) {
            city = longName;
          } else if (types.includes("administrative_area_level_2") && !city) {
            city = longName;
          } else if (types.includes("administrative_area_level_1")) {
            state = longName;
          }
        }
      }
    }

    return { latitude, longitude, streetNumber, postalCode, city, state, district };
  } catch (error) {
    console.error(`Failed to get details for place_id: ${placeId}`, error);
    return { latitude: 0, longitude: 0, streetNumber: "", postalCode: "", city: "", state: "", district: "" };
  }
}


export const getAddressSearchFunction = asyncHandler<EmptyBody, Address[], AddressSearchQuery>(200, async (req: AuthenticatedRequest<EmptyBody, AddressSearchQuery>) => {
  const { query } = req.params;
  const userId = req.userId;

  if (!userId) return unauthorized("User ID not found");

  if (!query || query.length < 2) return badRequest("Query is required and must be at least 2 characters long");

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return badRequest("Google Places API key not configured");


  try {
    // Call Google Places Autocomplete API
    const autocompleteUrl = `${AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}&key=${apiKey}&language=no&components=country:no&types=address`;
    const response = await axios.get<PlaceAutocompleteResponse>(autocompleteUrl);

    const results: Address[] = [];

    if (response.data.predictions) {
      // Process each prediction and get coordinates
      for (const prediction of response.data.predictions) {
        const placeId = prediction.place_id;

        // Get coordinates and detailed address components
        const details = await getPlaceDetails(placeId, apiKey);

        const result: Address = {
          placeId,
          street: prediction.structured_formatting?.main_text || prediction.description.split(',')[0] || "",
          city: details.city,
          state: details.state,
          zip: details.postalCode,
          country: "Norge",
          latitude: details.latitude,
          longitude: details.longitude
        };

        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching addresses:", error);
    throw error;
  }
});
