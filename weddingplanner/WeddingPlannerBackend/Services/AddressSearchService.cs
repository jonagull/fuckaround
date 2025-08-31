using System.Text.Json;
using System.Text.Json.Serialization;
using WeddingPlannerBackend.Models.Address;

namespace WeddingPlannerBackend.Services;

public class AddressSearchService : IAddressSearchService
{
  private readonly HttpClient _httpClient;
  private readonly IConfiguration _configuration;
  private readonly ILogger<AddressSearchService> _logger;
  private const string AutocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
  private const string DetailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";

  public AddressSearchService(HttpClient httpClient, IConfiguration configuration, ILogger<AddressSearchService> logger)
  {
    _httpClient = httpClient;
    _configuration = configuration;
    _logger = logger;
  }

  public async Task<List<ResponseAddressSearch>> SearchAddressAsync(RequestSearchAddress request)
  {
    _logger.LogInformation("Searching for address: {Query}", request.Query);

    var apiKey = _configuration["GooglePlaces:ApiKey"];
    if (string.IsNullOrEmpty(apiKey))
    {
      throw new InvalidOperationException("Google Places API key not configured");
    }

    if (string.IsNullOrWhiteSpace(request.Query) || request.Query.Length < 2)
    {
      return new List<ResponseAddressSearch>();
    }

    // Use Autocomplete API for better address matching
    var autocompleteUrl = $"{AutocompleteUrl}?input={Uri.EscapeDataString(request.Query)}&key={apiKey}&language=no&components=country:no&types=address";

    var response = await _httpClient.GetAsync(autocompleteUrl);
    response.EnsureSuccessStatusCode();

    var json = await response.Content.ReadAsStringAsync();
    _logger.LogInformation("Google Places Autocomplete response: {Response}", json.Substring(0, Math.Min(500, json.Length)));

    var options = new JsonSerializerOptions
    {
      PropertyNameCaseInsensitive = true
    };
    var autocompleteResponse = JsonSerializer.Deserialize<GoogleAutocompleteResponse>(json, options);

    var results = new List<ResponseAddressSearch>();

    if (autocompleteResponse?.Predictions != null)
    {
      _logger.LogInformation("Found {Count} predictions from Google Places API", autocompleteResponse.Predictions.Count);

      foreach (var prediction in autocompleteResponse.Predictions.Take(request.Limit))
      {
        // Get detailed information for each place
        var details = await GetPlaceDetailsAsync(prediction.PlaceId, apiKey);

        // Combine street name and number
        var street = details.StreetName;
        if (!string.IsNullOrEmpty(details.StreetNumber))
        {
          street = $"{street} {details.StreetNumber}";
        }

        results.Add(new ResponseAddressSearch
        {
          PlaceId = prediction.PlaceId,
          FormattedAddress = prediction.Description,
          Street = street,
          City = details.City,
          State = string.IsNullOrEmpty(details.State) ? "N/A" : details.State,
          Zip = details.PostalCode,
          Country = request.Country ?? "NO",
          Latitude = details.Latitude,
          Longitude = details.Longitude,
          PlaceType = "address"
        });
      }
    }
    else
    {
      _logger.LogWarning("No predictions found from Google Places API for query: {Query}", request.Query);
    }

    return results;
  }

  public async Task<ResponseAddressSearch> GetAddressDetailsAsync(string placeId)
  {
    _logger.LogInformation("Getting address details for placeId: {PlaceId}", placeId);

    var apiKey = _configuration["GooglePlaces:ApiKey"];
    if (string.IsNullOrEmpty(apiKey))
    {
      throw new InvalidOperationException("Google Places API key not configured");
    }

    var details = await GetPlaceDetailsAsync(placeId, apiKey);

    var street = details.StreetName;
    if (!string.IsNullOrEmpty(details.StreetNumber))
    {
      street = $"{street} {details.StreetNumber}";
    }

    return new ResponseAddressSearch
    {
      PlaceId = placeId,
      FormattedAddress = $"{street}, {details.PostalCode} {details.City}, Norge",
      Street = street,
      City = details.City,
      State = string.IsNullOrEmpty(details.State) ? "N/A" : details.State,
      Zip = details.PostalCode,
      Country = "NO",
      Latitude = details.Latitude,
      Longitude = details.Longitude,
      PlaceType = "address"
    };
  }

  private async Task<PlaceDetailsResult> GetPlaceDetailsAsync(string placeId, string apiKey)
  {
    try
    {
      var detailsUrl = $"{DetailsUrl}?place_id={placeId}&fields=geometry,address_components&key={apiKey}";
      var response = await _httpClient.GetAsync(detailsUrl);
      response.EnsureSuccessStatusCode();

      var json = await response.Content.ReadAsStringAsync();
      _logger.LogDebug("Place details response for {PlaceId}: {Response}", placeId, json.Substring(0, Math.Min(500, json.Length)));

      var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
      var detailsResponse = JsonSerializer.Deserialize<GoogleDetailsResponse>(json, options);

      var streetNumber = "";
      var streetName = "";
      var postalCode = "";
      var city = "";
      var state = "";
      var district = "";
      var latitude = 0.0;
      var longitude = 0.0;

      if (detailsResponse?.Result != null)
      {
        // Get coordinates
        if (detailsResponse.Result.Geometry?.Location != null)
        {
          latitude = detailsResponse.Result.Geometry.Location.Lat;
          longitude = detailsResponse.Result.Geometry.Location.Lng;
        }

        // Parse address components
        if (detailsResponse.Result.AddressComponents != null)
        {
          _logger.LogDebug("Address components for {PlaceId}:", placeId);
          foreach (var component in detailsResponse.Result.AddressComponents)
          {
            var types = component.Types ?? new List<string>();
            var longName = component.LongName ?? "";

            _logger.LogDebug("  Types: {Types}, Long: {LongName}", string.Join(", ", types), longName);

            if (types.Contains("street_number"))
            {
              streetNumber = longName;
            }
            else if (types.Contains("route"))
            {
              streetName = longName;
            }
            else if (types.Contains("postal_code"))
            {
              postalCode = longName;
            }
            else if (types.Contains("locality"))
            {
              city = longName;
            }
            else if (types.Contains("sublocality_level_1"))
            {
              district = longName;
            }
            else if (types.Contains("sublocality") && string.IsNullOrEmpty(city))
            {
              city = longName;
            }
            else if (types.Contains("administrative_area_level_2") && string.IsNullOrEmpty(city))
            {
              city = longName;
            }
            else if (types.Contains("administrative_area_level_1"))
            {
              state = longName;
            }
          }

          _logger.LogDebug("Final mapping - Street: '{StreetName} {StreetNumber}', City: '{City}', PostalCode: '{PostalCode}'",
            streetName, streetNumber, city, postalCode);
        }
      }

      return new PlaceDetailsResult
      {
        Latitude = latitude,
        Longitude = longitude,
        StreetNumber = streetNumber,
        StreetName = streetName,
        PostalCode = postalCode,
        City = city,
        State = state,
        District = district
      };
    }
    catch (Exception ex)
    {
      _logger.LogWarning(ex, "Failed to get details for place_id: {PlaceId}", placeId);
      return new PlaceDetailsResult();
    }
  }
}

// DTOs for Google Places API responses
internal class GoogleAutocompleteResponse
{
  [JsonPropertyName("predictions")]
  public List<GooglePrediction> Predictions { get; set; } = new();

  [JsonPropertyName("status")]
  public string Status { get; set; } = string.Empty;
}

internal class GooglePrediction
{
  [JsonPropertyName("place_id")]
  public string PlaceId { get; set; } = string.Empty;

  [JsonPropertyName("description")]
  public string Description { get; set; } = string.Empty;

  [JsonPropertyName("structured_formatting")]
  public StructuredFormatting? StructuredFormatting { get; set; }

  [JsonPropertyName("types")]
  public List<string> Types { get; set; } = new();
}

internal class StructuredFormatting
{
  [JsonPropertyName("main_text")]
  public string MainText { get; set; } = string.Empty;

  [JsonPropertyName("secondary_text")]
  public string SecondaryText { get; set; } = string.Empty;
}

internal class GoogleDetailsResponse
{
  [JsonPropertyName("result")]
  public GooglePlaceDetails? Result { get; set; }

  [JsonPropertyName("status")]
  public string Status { get; set; } = string.Empty;
}

internal class GooglePlaceDetails
{
  [JsonPropertyName("geometry")]
  public GoogleGeometry? Geometry { get; set; }

  [JsonPropertyName("address_components")]
  public List<AddressComponent>? AddressComponents { get; set; }
}

internal class GoogleGeometry
{
  [JsonPropertyName("location")]
  public GoogleLocation Location { get; set; } = new();
}

internal class GoogleLocation
{
  [JsonPropertyName("lat")]
  public double Lat { get; set; }

  [JsonPropertyName("lng")]
  public double Lng { get; set; }
}

internal class AddressComponent
{
  [JsonPropertyName("long_name")]
  public string LongName { get; set; } = string.Empty;

  [JsonPropertyName("short_name")]
  public string ShortName { get; set; } = string.Empty;

  [JsonPropertyName("types")]
  public List<string> Types { get; set; } = new();
}

internal class PlaceDetailsResult
{
  public double Latitude { get; set; }
  public double Longitude { get; set; }
  public string StreetNumber { get; set; } = string.Empty;
  public string StreetName { get; set; } = string.Empty;
  public string PostalCode { get; set; } = string.Empty;
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string District { get; set; } = string.Empty;
}
