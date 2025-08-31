namespace WeddingPlannerBackend.Models.GuestInvitations;

public class RequestUpdateGuestInvitation
{
    public bool? IsAccepted { get; set; }
    public int? AdditionalGuestsCount { get; set; }
    public List<AdditionalGuest>? AdditionalGuests { get; set; }
}

public class AdditionalGuest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}