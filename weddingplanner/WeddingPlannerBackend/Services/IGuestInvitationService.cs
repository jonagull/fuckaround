using WeddingPlannerBackend.Models.GuestInvitations;

namespace WeddingPlannerBackend.Services;

public interface IGuestInvitationService
{
    Task<ResponseGuestInvitation> CreateInvitationAsync(Guid userId, RequestCreateGuestInvitation request);
    Task<List<ResponseGuestInvitation>> GetEventInvitationsAsync(Guid eventId, Guid userId);
    Task<ResponseGuestInvitation> UpdateInvitationAsync(Guid invitationId, Guid userId, RequestUpdateGuestInvitation request);
    Task DeleteInvitationAsync(Guid invitationId, Guid userId);
    Task<ResponseGuestInvitation> GetInvitationByIdAsync(Guid invitationId);
}