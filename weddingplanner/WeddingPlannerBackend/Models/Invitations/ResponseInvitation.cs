using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Invitations;

public class ResponseInvitation
{
  public Guid Id { get; set; }
  public Guid EventId { get; set; }
  public string EventName { get; set; } = string.Empty;
  public Guid SenderId { get; set; }
  public string SenderName { get; set; } = string.Empty;
  public string SenderEmail { get; set; } = string.Empty;
  public Guid ReceiverId { get; set; }
  public string ReceiverName { get; set; } = string.Empty;
  public string ReceiverEmail { get; set; } = string.Empty;
  public EventRole Role { get; set; }
  public InvitationStatus Status { get; set; }
  public string? Message { get; set; }
  public DateTime ExpiresAt { get; set; }
  public DateTime CreatedAt { get; set; }
}
