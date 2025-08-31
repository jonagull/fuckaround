namespace WeddingPlannerBackend.Models.Users;

public class ResponseUserProfile
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public int EventsCount { get; set; }
    public int InvitationsCount { get; set; }
}