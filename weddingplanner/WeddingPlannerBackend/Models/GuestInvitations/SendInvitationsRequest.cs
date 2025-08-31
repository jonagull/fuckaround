namespace WeddingPlannerBackend.Models.GuestInvitations;

public class SendInvitationsRequest
{
    public List<Guid> InvitationIds { get; set; } = new();
}