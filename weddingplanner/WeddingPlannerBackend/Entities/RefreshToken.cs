using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Entities;

public class RefreshToken
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public string Token { get; set; } = string.Empty;

  [Required]
  public Guid UserId { get; set; }

  public User User { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
