namespace WeddingPlannerBackend.Models.Auth;

public class ResponseAuthMobile
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public ResponseUser User { get; set; } = null!;
}