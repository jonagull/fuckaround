using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Entities;
using WeddingPlannerBackend.Models.GuestInvitations;

namespace WeddingPlannerBackend.Services;

public class GuestInvitationService : IGuestInvitationService
{
  private readonly ApplicationDbContext _context;

  public GuestInvitationService(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<ResponseGuestInvitation> CreateInvitationAsync(Guid userId, RequestCreateGuestInvitation request)
  {
    // Check if user has access to the event
    var userEvent = await _context.UserEvents
        .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.EventId == request.EventId);

    if (userEvent == null)
      throw new UnauthorizedAccessException("You don't have access to this event");

    // Only OWNER and PLANNER can send invitations
    if (userEvent.Role != EventRole.OWNER && userEvent.Role != EventRole.PLANNER)
      throw new UnauthorizedAccessException("Only event owners and planners can send invitations");

    var eventEntity = await _context.Events
        .FirstOrDefaultAsync(e => e.Id == request.EventId);

    if (eventEntity == null)
      throw new KeyNotFoundException("Event not found");

    // Check if invitation already exists for this email
    var existingInvitation = await _context.Invitations
        .FirstOrDefaultAsync(i => i.EventId == request.EventId && i.GuestEmail == request.GuestInfo.Email);

    if (existingInvitation != null)
      throw new InvalidOperationException("An invitation already exists for this guest");

    var invitation = new Invitation
    {
      EventId = request.EventId,
      GuestFirstName = request.GuestInfo.FirstName,
      GuestLastName = request.GuestInfo.LastName,
      GuestEmail = request.GuestInfo.Email,
      GuestPhoneNumber = request.GuestInfo.PhoneNumber,
      GuestPhoneCountryCode = request.GuestInfo.PhoneCountryCode,
      AdditionalGuestsCount = request.AdditionalGuestsCount,
      AdditionalGuests = "[]", // Empty JSON array
      InvitedAt = DateTime.UtcNow
    };

    _context.Invitations.Add(invitation);
    await _context.SaveChangesAsync();

    return MapToResponse(invitation, eventEntity);
  }

  public async Task<List<ResponseGuestInvitation>> GetEventInvitationsAsync(Guid eventId, Guid userId)
  {
    // Check if user has access to the event
    var userEvent = await _context.UserEvents
        .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.EventId == eventId);

    if (userEvent == null)
      throw new UnauthorizedAccessException("You don't have access to this event");

    var invitations = await _context.Invitations
        .Include(i => i.Event)
        .Where(i => i.EventId == eventId)
        .OrderByDescending(i => i.CreatedAt)
        .ToListAsync();

    return invitations.Select(i => MapToResponse(i, i.Event)).ToList();
  }

  public async Task<ResponseGuestInvitation> UpdateInvitationAsync(Guid invitationId, Guid userId, RequestUpdateGuestInvitation request)
  {
    var invitation = await _context.Invitations
        .Include(i => i.Event)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
      throw new KeyNotFoundException("Invitation not found");

    // Check if user has access to the event
    var userEvent = await _context.UserEvents
        .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.EventId == invitation.EventId);

    if (userEvent == null)
      throw new UnauthorizedAccessException("You don't have access to this event");

    // Update acceptance status
    if (request.IsAccepted.HasValue)
    {
      if (request.IsAccepted.Value)
      {
        invitation.AcceptedAt = DateTime.UtcNow;
        invitation.RejectedAt = null;
      }
      else
      {
        invitation.RejectedAt = DateTime.UtcNow;
        invitation.AcceptedAt = null;
      }
    }

    // Update additional guests count
    if (request.AdditionalGuestsCount.HasValue)
    {
      invitation.AdditionalGuestsCount = request.AdditionalGuestsCount.Value;
    }

    // Update additional guests list
    if (request.AdditionalGuests != null)
    {
      invitation.AdditionalGuests = JsonSerializer.Serialize(request.AdditionalGuests);
    }

    invitation.UpdatedAt = DateTime.UtcNow;
    await _context.SaveChangesAsync();

    return MapToResponse(invitation, invitation.Event);
  }

  public async Task DeleteInvitationAsync(Guid invitationId, Guid userId)
  {
    var invitation = await _context.Invitations
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
      throw new KeyNotFoundException("Invitation not found");

    // Check if user has access to the event
    var userEvent = await _context.UserEvents
        .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.EventId == invitation.EventId);

    if (userEvent == null)
      throw new UnauthorizedAccessException("You don't have access to this event");

    // Only OWNER and PLANNER can delete invitations
    if (userEvent.Role != EventRole.OWNER && userEvent.Role != EventRole.PLANNER)
      throw new UnauthorizedAccessException("Only event owners and planners can delete invitations");

    _context.Invitations.Remove(invitation);
    await _context.SaveChangesAsync();
  }

  public async Task<ResponseGuestInvitation> GetInvitationByIdAsync(Guid invitationId)
  {
    var invitation = await _context.Invitations
        .Include(i => i.Event)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
      throw new KeyNotFoundException("Invitation not found");

    return MapToResponse(invitation, invitation.Event);
  }

  private ResponseGuestInvitation MapToResponse(Invitation invitation, Event eventEntity)
  {
    var additionalGuests = new List<AdditionalGuest>();

    try
    {
      if (!string.IsNullOrEmpty(invitation.AdditionalGuests) && invitation.AdditionalGuests != "[]")
      {
        additionalGuests = JsonSerializer.Deserialize<List<AdditionalGuest>>(invitation.AdditionalGuests) ?? new List<AdditionalGuest>();
      }
    }
    catch
    {
      // If deserialization fails, return empty list
    }

    return new ResponseGuestInvitation
    {
      Id = invitation.Id,
      EventId = invitation.EventId,
      EventName = eventEntity.EventName,
      EventDate = eventEntity.EventDate,
      GuestFirstName = invitation.GuestFirstName,
      GuestLastName = invitation.GuestLastName,
      GuestEmail = invitation.GuestEmail,
      GuestPhoneNumber = invitation.GuestPhoneNumber,
      GuestPhoneCountryCode = invitation.GuestPhoneCountryCode,
      InvitedAt = invitation.InvitedAt,
      AcceptedAt = invitation.AcceptedAt,
      RejectedAt = invitation.RejectedAt,
      AdditionalGuestsCount = invitation.AdditionalGuestsCount,
      AdditionalGuests = additionalGuests,
      CreatedAt = invitation.CreatedAt,
      UpdatedAt = invitation.UpdatedAt
    };
  }
}
