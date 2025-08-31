using System.Text.Json;

namespace WeddingPlannerBackend.Models.GuestInvitations;

public class ResponseGuestInvitation
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public DateTime? EventDate { get; set; }
    public string GuestFirstName { get; set; } = string.Empty;
    public string GuestLastName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public string GuestPhoneNumber { get; set; } = string.Empty;
    public string GuestPhoneCountryCode { get; set; } = string.Empty;
    public DateTime InvitedAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public int AdditionalGuestsCount { get; set; }
    public List<AdditionalGuest> AdditionalGuests { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public string Status 
    { 
        get 
        {
            if (AcceptedAt.HasValue) return "ACCEPTED";
            if (RejectedAt.HasValue) return "REJECTED";
            return "PENDING";
        }
    }
}