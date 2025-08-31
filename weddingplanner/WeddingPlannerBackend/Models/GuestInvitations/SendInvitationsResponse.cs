namespace WeddingPlannerBackend.Models.GuestInvitations;

public class SendInvitationsResponse
{
    public int TotalRequested { get; set; }
    public int SuccessfullySent { get; set; }
    public int Failed { get; set; }
    public List<InvitationSendResult> Results { get; set; } = new();
}

public class InvitationSendResult
{
    public Guid InvitationId { get; set; }
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public string? InvitationUrl { get; set; }
}