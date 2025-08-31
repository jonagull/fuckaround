using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Entities;

public enum EventRole
{
  OWNER,
  PLANNER,
  VENDOR,
  GUEST
}

public class UserEvent
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public Guid EventId { get; set; }
  public Event Event { get; set; } = null!;

  [Required]
  public Guid UserId { get; set; }
  public User User { get; set; } = null!;

  [Required]
  public EventRole Role { get; set; }

  public string StringRole { get; set; } = string.Empty;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
