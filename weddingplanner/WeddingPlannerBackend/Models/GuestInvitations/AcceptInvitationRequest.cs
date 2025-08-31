namespace WeddingPlannerBackend.Models.GuestInvitations;

public class AcceptInvitationRequest
{
    public List<AdditionalGuestRequest>? AdditionalGuests { get; set; }
}

public class AdditionalGuestRequest
{
    public string Name { get; set; } = string.Empty;
}