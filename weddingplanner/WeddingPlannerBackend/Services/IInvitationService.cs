using WeddingPlannerBackend.Models.Invitations;

namespace WeddingPlannerBackend.Services;

public interface IInvitationService
{
    Task<ResponseInvitation> SendInvitationAsync(Guid eventId, Guid senderId, RequestSendInvitation request);
    Task<ResponseInvitation> AcceptInvitationAsync(Guid invitationId, Guid userId);
    Task<ResponseInvitation> RejectInvitationAsync(Guid invitationId, Guid userId);
    Task<List<ResponseInvitation>> GetUserInvitationsAsync(Guid userId);
    Task<List<ResponseInvitation>> GetEventInvitationsAsync(Guid eventId, Guid userId);
    Task CancelInvitationAsync(Guid invitationId, Guid userId);
}