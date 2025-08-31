using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Models.GuestInvitations;

public class RequestParseCsvGuests
{
    [Required]
    public IFormFile CsvFile { get; set; } = null!;
}

