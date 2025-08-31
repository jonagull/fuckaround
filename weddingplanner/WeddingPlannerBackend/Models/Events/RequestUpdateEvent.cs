using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Events;

public class RequestUpdateEvent
{
    public string? EventName { get; set; }
    public string? EventDescription { get; set; }
    public EventType? EventType { get; set; }
    public DateTime? EventDate { get; set; }
    public RequestAddress? VenueAddress { get; set; }
}