namespace WeddingPlannerBackend.Models.Invitations;

public class ResponseListPlannerInvitations
{
    public List<ResponseInvitationWithRelations> Sent { get; set; } = new();
    public List<ResponseInvitationWithRelations> Received { get; set; } = new();
}