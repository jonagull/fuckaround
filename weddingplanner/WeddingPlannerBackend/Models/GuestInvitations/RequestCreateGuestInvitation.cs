using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Models.GuestInvitations;

public class RequestCreateGuestInvitation
{
    [Required]
    public Guid EventId { get; set; }

    [Required]
    public GuestInfo GuestInfo { get; set; } = null!;

    public int AdditionalGuestsCount { get; set; } = 0;
}

public class GuestInfo
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string PhoneCountryCode { get; set; } = string.Empty;
}