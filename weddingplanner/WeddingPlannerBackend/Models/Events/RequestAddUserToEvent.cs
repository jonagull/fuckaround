using System.ComponentModel.DataAnnotations;
using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Models.Events;

public class RequestAddUserToEvent
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public EventRole Role { get; set; }
}