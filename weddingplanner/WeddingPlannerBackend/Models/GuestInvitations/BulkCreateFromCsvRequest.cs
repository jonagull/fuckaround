using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Models.GuestInvitations;

public class BulkCreateFromCsvRequest
{
    [Required]
    public Guid EventId { get; set; }
    
    [Required]
    public IFormFile CsvFile { get; set; } = null!;
}