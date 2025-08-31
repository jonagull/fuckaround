using System.ComponentModel.DataAnnotations;
using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Events;

public class RequestCreateEvent
{
  [Required]
  public string EventName { get; set; } = string.Empty;

  public string? EventDescription { get; set; }

  [Required]
  public EventType EventType { get; set; }

  public DateTime? EventDate { get; set; }

  public RequestAddress? VenueAddress { get; set; }
}

public class RequestAddress
{
  [Required]
  public string Street { get; set; } = string.Empty;

  [Required]
  public string City { get; set; } = string.Empty;

  public string? State { get; set; }

  [Required]
  public string Zip { get; set; } = string.Empty;

  [Required]
  public string Country { get; set; } = string.Empty;

  public double Latitude { get; set; }
  public double Longitude { get; set; }

  [Required]
  public string PlaceId { get; set; } = string.Empty;
}
