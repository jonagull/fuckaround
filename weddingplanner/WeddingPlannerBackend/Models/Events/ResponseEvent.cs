using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Events;

public class ResponseEvent
{
  public Guid Id { get; set; }
  public string EventName { get; set; } = string.Empty;
  public string? EventDescription { get; set; }
  public EventType EventType { get; set; }
  public DateTime? EventDate { get; set; }
  public ResponseAddress? VenueAddress { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
  public List<ResponseUserEvent> Planners { get; set; } = new();
}

public class ResponseAddress
{
  public Guid Id { get; set; }
  public string Street { get; set; } = string.Empty;
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string Zip { get; set; } = string.Empty;
  public string Country { get; set; } = string.Empty;
  public double Latitude { get; set; }
  public double Longitude { get; set; }
  public string PlaceId { get; set; } = string.Empty;
}

public class ResponseUserEvent
{
  public Guid UserId { get; set; }
  public string UserName { get; set; } = string.Empty;
  public string UserEmail { get; set; } = string.Empty;
  public EventRole Role { get; set; }
}
