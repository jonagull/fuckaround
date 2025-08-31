using Microsoft.EntityFrameworkCore;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Entities;
using WeddingPlannerBackend.Models.Events;

namespace WeddingPlannerBackend.Services;

public class EventService : IEventService
{
    private readonly ApplicationDbContext _context;

    public EventService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ResponseEvent> CreateEventAsync(Guid userId, RequestCreateEvent request)
    {
        var eventEntity = new Event
        {
            EventName = request.EventName,
            EventDescription = request.EventDescription,
            EventType = request.EventType,
            EventDate = request.EventDate
        };

        // Create address if provided
        if (request.VenueAddress != null)
        {
            var address = new Address
            {
                Street = request.VenueAddress.Street,
                City = request.VenueAddress.City,
                State = string.IsNullOrEmpty(request.VenueAddress.State) ? "N/A" : request.VenueAddress.State,
                Zip = request.VenueAddress.Zip,
                Country = request.VenueAddress.Country,
                Latitude = request.VenueAddress.Latitude,
                Longitude = request.VenueAddress.Longitude,
                PlaceId = request.VenueAddress.PlaceId
            };
            _context.Addresses.Add(address);
            eventEntity.VenueAddress = address;
        }

        _context.Events.Add(eventEntity);

        // Add creator as owner
        var userEvent = new UserEvent
        {
            EventId = eventEntity.Id,
            UserId = userId,
            Role = EventRole.OWNER,
            StringRole = EventRole.OWNER.ToString()
        };
        _context.UserEvents.Add(userEvent);

        await _context.SaveChangesAsync();

        return await GetEventByIdAsync(eventEntity.Id, userId);
    }

    public async Task<ResponseEvent> GetEventByIdAsync(Guid eventId, Guid userId)
    {
        var eventEntity = await _context.Events
            .Include(e => e.VenueAddress)
            .Include(e => e.Planners)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventEntity == null)
            throw new KeyNotFoundException("Event not found");

        // Check if user has access
        var hasAccess = eventEntity.Planners.Any(p => p.UserId == userId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this event");

        return MapToResponseEvent(eventEntity);
    }

    public async Task<List<ResponseEvent>> GetUserEventsAsync(Guid userId)
    {
        var events = await _context.UserEvents
            .Where(ue => ue.UserId == userId)
            .Include(ue => ue.Event)
                .ThenInclude(e => e.VenueAddress)
            .Include(ue => ue.Event)
                .ThenInclude(e => e.Planners)
                    .ThenInclude(p => p.User)
            .Select(ue => ue.Event)
            .ToListAsync();

        return events.Select(MapToResponseEvent).ToList();
    }

    public async Task<ResponseEvent> UpdateEventAsync(Guid eventId, Guid userId, RequestUpdateEvent request)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Planners)
            .Include(e => e.VenueAddress)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventEntity == null)
            throw new KeyNotFoundException("Event not found");

        // Check if user is owner
        var isOwner = eventEntity.Planners.Any(p => p.UserId == userId && p.Role == EventRole.OWNER);
        if (!isOwner)
            throw new UnauthorizedAccessException("Only event owners can update events");

        // Update fields if provided
        if (!string.IsNullOrEmpty(request.EventName))
            eventEntity.EventName = request.EventName;
        
        if (request.EventDescription != null)
            eventEntity.EventDescription = request.EventDescription;
        
        if (request.EventType.HasValue)
            eventEntity.EventType = request.EventType.Value;
        
        if (request.EventDate.HasValue)
            eventEntity.EventDate = request.EventDate;

        // Update or create address
        if (request.VenueAddress != null)
        {
            if (eventEntity.VenueAddress != null)
            {
                // Update existing address
                eventEntity.VenueAddress.Street = request.VenueAddress.Street;
                eventEntity.VenueAddress.City = request.VenueAddress.City;
                eventEntity.VenueAddress.State = request.VenueAddress.State;
                eventEntity.VenueAddress.Zip = request.VenueAddress.Zip;
                eventEntity.VenueAddress.Country = request.VenueAddress.Country;
                eventEntity.VenueAddress.Latitude = request.VenueAddress.Latitude;
                eventEntity.VenueAddress.Longitude = request.VenueAddress.Longitude;
                eventEntity.VenueAddress.PlaceId = request.VenueAddress.PlaceId;
            }
            else
            {
                // Create new address
                var address = new Address
                {
                    Street = request.VenueAddress.Street,
                    City = request.VenueAddress.City,
                    State = request.VenueAddress.State,
                    Zip = request.VenueAddress.Zip,
                    Country = request.VenueAddress.Country,
                    Latitude = request.VenueAddress.Latitude,
                    Longitude = request.VenueAddress.Longitude,
                    PlaceId = request.VenueAddress.PlaceId
                };
                _context.Addresses.Add(address);
                eventEntity.VenueAddress = address;
            }
        }

        await _context.SaveChangesAsync();
        return await GetEventByIdAsync(eventId, userId);
    }

    public async Task DeleteEventAsync(Guid eventId, Guid userId)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Planners)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventEntity == null)
            throw new KeyNotFoundException("Event not found");

        // Check if user is owner
        var isOwner = eventEntity.Planners.Any(p => p.UserId == userId && p.Role == EventRole.OWNER);
        if (!isOwner)
            throw new UnauthorizedAccessException("Only event owners can delete events");

        _context.Events.Remove(eventEntity);
        await _context.SaveChangesAsync();
    }

    public async Task<ResponseUserEvent> AddUserToEventAsync(Guid eventId, Guid ownerId, RequestAddUserToEvent request)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Planners)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventEntity == null)
            throw new KeyNotFoundException("Event not found");

        // Check if requester is owner
        var isOwner = eventEntity.Planners.Any(p => p.UserId == ownerId && p.Role == EventRole.OWNER);
        if (!isOwner)
            throw new UnauthorizedAccessException("Only event owners can add users");

        // Find user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        // Check if user already in event
        if (eventEntity.Planners.Any(p => p.UserId == user.Id))
            throw new InvalidOperationException("User already in event");

        var userEvent = new UserEvent
        {
            EventId = eventId,
            UserId = user.Id,
            Role = request.Role,
            StringRole = request.Role.ToString()
        };

        _context.UserEvents.Add(userEvent);
        await _context.SaveChangesAsync();

        return new ResponseUserEvent
        {
            UserId = user.Id,
            UserName = user.Name,
            UserEmail = user.Email,
            Role = request.Role
        };
    }

    public async Task RemoveUserFromEventAsync(Guid eventId, Guid ownerId, Guid userToRemoveId)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Planners)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventEntity == null)
            throw new KeyNotFoundException("Event not found");

        // Check if requester is owner
        var isOwner = eventEntity.Planners.Any(p => p.UserId == ownerId && p.Role == EventRole.OWNER);
        if (!isOwner)
            throw new UnauthorizedAccessException("Only event owners can remove users");

        var userEvent = eventEntity.Planners.FirstOrDefault(p => p.UserId == userToRemoveId);
        if (userEvent == null)
            throw new KeyNotFoundException("User not in event");

        if (userEvent.Role == EventRole.OWNER)
            throw new InvalidOperationException("Cannot remove event owner");

        _context.UserEvents.Remove(userEvent);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ResponseUserEvent>> GetEventUsersAsync(Guid eventId, Guid userId)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Planners)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (eventEntity == null)
            throw new KeyNotFoundException("Event not found");

        // Check if user has access
        var hasAccess = eventEntity.Planners.Any(p => p.UserId == userId);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You don't have access to this event");

        return eventEntity.Planners.Select(p => new ResponseUserEvent
        {
            UserId = p.UserId,
            UserName = p.User.Name,
            UserEmail = p.User.Email,
            Role = p.Role
        }).ToList();
    }

    private ResponseEvent MapToResponseEvent(Event eventEntity)
    {
        return new ResponseEvent
        {
            Id = eventEntity.Id,
            EventName = eventEntity.EventName,
            EventDescription = eventEntity.EventDescription,
            EventType = eventEntity.EventType,
            EventDate = eventEntity.EventDate,
            CreatedAt = eventEntity.CreatedAt,
            UpdatedAt = eventEntity.UpdatedAt,
            VenueAddress = eventEntity.VenueAddress != null ? new ResponseAddress
            {
                Id = eventEntity.VenueAddress.Id,
                Street = eventEntity.VenueAddress.Street,
                City = eventEntity.VenueAddress.City,
                State = eventEntity.VenueAddress.State,
                Zip = eventEntity.VenueAddress.Zip,
                Country = eventEntity.VenueAddress.Country,
                Latitude = eventEntity.VenueAddress.Latitude,
                Longitude = eventEntity.VenueAddress.Longitude,
                PlaceId = eventEntity.VenueAddress.PlaceId
            } : null,
            Planners = eventEntity.Planners.Select(p => new ResponseUserEvent
            {
                UserId = p.UserId,
                UserName = p.User.Name,
                UserEmail = p.User.Email,
                Role = p.Role
            }).ToList()
        };
    }
}