namespace WeddingPlannerBackend.Models.Auth;

public class ResponseAuth
{
  public string AccessToken { get; set; } = string.Empty;
  public string RefreshToken { get; set; } = string.Empty;
  public ResponseUser User { get; set; } = null!;
}

public class ResponseUser
{
  public Guid Id { get; set; }
  public string Email { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string? Phone { get; set; }
}
