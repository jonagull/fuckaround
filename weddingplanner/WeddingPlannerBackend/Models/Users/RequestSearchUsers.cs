namespace WeddingPlannerBackend.Models.Users;

public class RequestSearchUsers
{
    public string? Query { get; set; }
    public int PageSize { get; set; } = 10;
    public int Page { get; set; } = 1;
}