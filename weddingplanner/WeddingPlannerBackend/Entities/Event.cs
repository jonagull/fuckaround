using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Entities;

public enum EventType
{
  WEDDING,
  BIRTHDAY,
  CORPORATE,
  OTHER
}

public class Event
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public string EventName { get; set; } = string.Empty;

  public string? EventDescription { get; set; }

  [Required]
  public EventType EventType { get; set; }

  public DateTime? EventDate { get; set; }

  public Guid? VenueAddressId { get; set; }
  public Address? VenueAddress { get; set; }

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

  // Navigation properties
  public ICollection<UserEvent> Planners { get; set; } = new List<UserEvent>();
  public ICollection<PlannerInvitation> Invitations { get; set; } = new List<PlannerInvitation>();
  public ICollection<Invitation> GuestInvitations { get; set; } = new List<Invitation>();
}
