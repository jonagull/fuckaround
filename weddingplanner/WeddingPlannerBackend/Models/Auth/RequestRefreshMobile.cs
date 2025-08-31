using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Models.Auth;

public class RequestRefreshMobile
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}