namespace WeddingPlannerBackend.Models.GuestInvitations;

public class ResponseBulkCreateInvitations
{
    public List<ResponseGuestInvitation> SuccessfulInvitations { get; set; } = new();
    public List<BulkInvitationError> Errors { get; set; } = new();
    public int TotalRequested { get; set; }
    public int SuccessCount { get; set; }
    public int ErrorCount { get; set; }
}

public class BulkInvitationError
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string ErrorType { get; set; } = string.Empty; // "DUPLICATE", "VALIDATION", "OTHER"
    public string ErrorMessage { get; set; } = string.Empty;
}
