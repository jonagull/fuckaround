using WeddingPlannerBackend.Models.Events;

namespace WeddingPlannerBackend.Services;

public interface IEventService
{
    Task<ResponseEvent> CreateEventAsync(Guid userId, RequestCreateEvent request);
    Task<ResponseEvent> GetEventByIdAsync(Guid eventId, Guid userId);
    Task<List<ResponseEvent>> GetUserEventsAsync(Guid userId);
    Task<ResponseEvent> UpdateEventAsync(Guid eventId, Guid userId, RequestUpdateEvent request);
    Task DeleteEventAsync(Guid eventId, Guid userId);
    Task<ResponseUserEvent> AddUserToEventAsync(Guid eventId, Guid ownerId, RequestAddUserToEvent request);
    Task RemoveUserFromEventAsync(Guid eventId, Guid ownerId, Guid userToRemoveId);
    Task<List<ResponseUserEvent>> GetEventUsersAsync(Guid eventId, Guid userId);
}