using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Invitations;

public class ResponseInvitationWithRelations
{
    public string Id { get; set; } = string.Empty;
    public string EventId { get; set; } = string.Empty;
    public EventInfo Event { get; set; } = new();
    public UserInfo Sender { get; set; } = new();
    public UserInfo Receiver { get; set; } = new();
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Message { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EventInfo
{
    public string Id { get; set; } = string.Empty;
    public string EventName { get; set; } = string.Empty;
    public DateTime? EventDate { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
}

public class UserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}