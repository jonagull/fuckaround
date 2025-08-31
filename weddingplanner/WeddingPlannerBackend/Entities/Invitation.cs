using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace WeddingPlannerBackend.Entities;

public class Invitation
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public Guid EventId { get; set; }
  public Event Event { get; set; } = null!;

  [Required]
  public string GuestFirstName { get; set; } = string.Empty;

  [Required]
  public string GuestLastName { get; set; } = string.Empty;

  [Required]
  [EmailAddress]
  public string GuestEmail { get; set; } = string.Empty;

  [Required]
  public string GuestPhoneNumber { get; set; } = string.Empty;

  [Required]
  public string GuestPhoneCountryCode { get; set; } = string.Empty;

  public DateTime InvitedAt { get; set; } = DateTime.UtcNow;
  public DateTime? AcceptedAt { get; set; }
  public DateTime? RejectedAt { get; set; }

  public int AdditionalGuestsCount { get; set; } = 0;
  public string AdditionalGuests { get; set; } = "[]"; // JSON string

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
