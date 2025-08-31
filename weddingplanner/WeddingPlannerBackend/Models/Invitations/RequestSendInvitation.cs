using System.ComponentModel.DataAnnotations;
using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Invitations;

public class RequestSendInvitation
{
  [Required]
  [EmailAddress]
  public string ReceiverEmail { get; set; } = string.Empty;

  [Required]
  public EventRole Role { get; set; } = EventRole.PLANNER;

  public string? Message { get; set; }
}
