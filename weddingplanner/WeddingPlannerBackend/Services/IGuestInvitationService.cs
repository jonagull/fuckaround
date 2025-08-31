using WeddingPlannerBackend.Models.GuestInvitations;

namespace WeddingPlannerBackend.Services;

public interface IGuestInvitationService
{
    Task<ResponseGuestInvitation> CreateInvitationAsync(Guid userId, RequestCreateGuestInvitation request);
    Task<ResponseBulkCreateInvitations> BulkCreateInvitationsAsync(Guid userId, List<RequestCreateGuestInvitation> requests);
    Task<List<ResponseGuestInvitation>> GetEventInvitationsAsync(Guid eventId, Guid userId);
    Task<ResponseGuestInvitation> UpdateInvitationAsync(Guid invitationId, Guid userId, RequestUpdateGuestInvitation request);
    Task DeleteInvitationAsync(Guid invitationId, Guid userId);
    Task<ResponseGuestInvitation> GetInvitationByIdAsync(Guid invitationId);
    Task<SendInvitationsResponse> SendInvitationsAsync(Guid userId, SendInvitationsRequest request);
    Task<ResponseGuestInvitation> AcceptInvitationAsync(Guid invitationId, AcceptInvitationRequest request);
    Task<ResponseGuestInvitation> DeclineInvitationAsync(Guid invitationId);
}