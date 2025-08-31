using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Entities;

public class User
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  [EmailAddress]
  public string Email { get; set; } = string.Empty;

  [Required]
  public string Name { get; set; } = string.Empty;

  public string? Phone { get; set; }

  [Required]
  public string HashedPassword { get; set; } = string.Empty;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

  // Navigation properties
  public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
  public ICollection<UserEvent> UserEvents { get; set; } = new List<UserEvent>();
  public ICollection<PlannerInvitation> SentInvitations { get; set; } = new List<PlannerInvitation>();
  public ICollection<PlannerInvitation> ReceivedInvitations { get; set; } = new List<PlannerInvitation>();
}
