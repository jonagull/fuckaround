namespace WeddingPlannerBackend.Models.Address;

public class ResponseAddressSearch
{
  public string PlaceId { get; set; } = string.Empty;
  public string FormattedAddress { get; set; } = string.Empty;
  public string Street { get; set; } = string.Empty;
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string Zip { get; set; } = string.Empty;
  public string Country { get; set; } = string.Empty;
  public double Latitude { get; set; }
  public double Longitude { get; set; }
  public string PlaceType { get; set; } = string.Empty;
}
