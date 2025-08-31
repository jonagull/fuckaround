namespace WeddingPlannerBackend.Models.Auth;

public class ResponseAuthWeb
{
    public string AccessToken { get; set; } = string.Empty;
    public ResponseUser User { get; set; } = null!;
}