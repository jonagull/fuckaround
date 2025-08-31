using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Models.Auth;

public class RequestLogin
{
  [Required]
  [EmailAddress]
  public string Email { get; set; } = string.Empty;

  [Required]
  public string Password { get; set; } = string.Empty;
}
