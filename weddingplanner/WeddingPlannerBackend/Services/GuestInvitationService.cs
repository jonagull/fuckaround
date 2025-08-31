using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Entities;
using WeddingPlannerBackend.Models.GuestInvitations;

namespace WeddingPlannerBackend.Services;

public class GuestInvitationService : IGuestInvitationService
{
  private readonly ApplicationDbContext _context;
  private readonly IEmailService _emailService;
  private readonly IConfiguration _configuration;

  public GuestInvitationService(ApplicationDbContext context, IEmailService emailService, IConfiguration configuration)
  {
    _context = context;
    _emailService = emailService;
    _configuration = configuration;
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

  public async Task<List<ResponseGuestInvitation>> BulkCreateInvitationsAsync(Guid userId, List<RequestCreateGuestInvitation> requests)
  {
    if (!requests.Any())
      throw new ArgumentException("No invitations provided");

    // Get the event ID from the first request (all should be for the same event)
    var eventId = requests.First().EventId;

    // Validate all requests are for the same event
    if (requests.Any(r => r.EventId != eventId))
      throw new ArgumentException("All invitations must be for the same event");

    // Check if user has access to the event
    var userEvent = await _context.UserEvents
        .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.EventId == eventId);

    if (userEvent == null)
      throw new UnauthorizedAccessException("You don't have access to this event");

    // Only OWNER and PLANNER can send invitations
    if (userEvent.Role != EventRole.OWNER && userEvent.Role != EventRole.PLANNER)
      throw new UnauthorizedAccessException("Only event owners and planners can send invitations");

    var eventEntity = await _context.Events
        .FirstOrDefaultAsync(e => e.Id == eventId);

    if (eventEntity == null)
      throw new KeyNotFoundException("Event not found");

    // Get existing invitations for this event to check for duplicates
    var existingEmails = await _context.Invitations
        .Where(i => i.EventId == eventId)
        .Select(i => i.GuestEmail.ToLower())
        .ToListAsync();

    var results = new List<ResponseGuestInvitation>();
    var invitationsToAdd = new List<Invitation>();

    foreach (var request in requests)
    {
      try
      {
        // Check if invitation already exists for this email
        if (existingEmails.Contains(request.GuestInfo.Email.ToLower()))
        {
          // Skip duplicates - don't add to results, just continue
          continue;
        }

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

        invitationsToAdd.Add(invitation);
        // Add to existing emails to prevent duplicates within the same bulk request
        existingEmails.Add(request.GuestInfo.Email.ToLower());
      }
      catch (Exception)
      {
        // Skip invalid requests - just continue to next one
        continue;
      }
    }

    // Add all valid invitations to the database in one go
    if (invitationsToAdd.Any())
    {
      _context.Invitations.AddRange(invitationsToAdd);
      await _context.SaveChangesAsync();

      // Map all successfully created invitations to response objects
      foreach (var invitation in invitationsToAdd)
      {
        results.Add(MapToResponse(invitation, eventEntity));
      }
    }

    return results;
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
      EmailSentAt = invitation.EmailSentAt,
      AcceptedAt = invitation.AcceptedAt,
      RejectedAt = invitation.RejectedAt,
      AdditionalGuestsCount = invitation.AdditionalGuestsCount,
      AdditionalGuests = additionalGuests,
      CreatedAt = invitation.CreatedAt,
      UpdatedAt = invitation.UpdatedAt
    };
  }

  public async Task<SendInvitationsResponse> SendInvitationsAsync(Guid userId, SendInvitationsRequest request)
  {
    var response = new SendInvitationsResponse
    {
      TotalRequested = request.InvitationIds.Count
    };

    // Verify user has access to send invitations
    var invitations = await _context.Invitations
        .Include(i => i.Event)
        .Where(i => request.InvitationIds.Contains(i.Id))
        .ToListAsync();

    if (!invitations.Any())
    {
      throw new KeyNotFoundException("No invitations found");
    }

    // Check if user has permission for all invitations
    var eventIds = invitations.Select(i => i.EventId).Distinct();
    var userEvents = await _context.UserEvents
        .Where(ue => ue.UserId == userId && eventIds.Contains(ue.EventId))
        .ToListAsync();

    foreach (var eventId in eventIds)
    {
      var userEvent = userEvents.FirstOrDefault(ue => ue.EventId == eventId);
      if (userEvent == null || (userEvent.Role != EventRole.OWNER && userEvent.Role != EventRole.PLANNER))
      {
        throw new UnauthorizedAccessException("You don't have permission to send invitations for this event");
      }
    }

    // Get base URL from configuration or use localhost for development
    var baseUrl = _configuration["BaseUrl"] ?? "http://localhost:3050";

    // Send emails for each invitation
    foreach (var invitation in invitations)
    {
      var result = new InvitationSendResult
      {
        InvitationId = invitation.Id
      };

      try
      {
        // Generate invitation URL
        var invitationUrl = $"{baseUrl}/invitation/{invitation.Id}";
        result.InvitationUrl = invitationUrl;

        // Send email
        var emailSent = await _emailService.SendInvitationEmailAsync(
            invitation.GuestEmail,
            invitation.Event.EventName,
            invitationUrl
        );

        if (emailSent)
        {
          // Update invitation with email sent timestamp
          invitation.EmailSentAt = DateTime.UtcNow;
          invitation.UpdatedAt = DateTime.UtcNow;
          
          result.Success = true;
          response.SuccessfullySent++;
        }
        else
        {
          result.Success = false;
          result.ErrorMessage = "Failed to send email";
          response.Failed++;
        }
      }
      catch (Exception ex)
      {
        result.Success = false;
        result.ErrorMessage = ex.Message;
        response.Failed++;
      }

      response.Results.Add(result);
    }

    // Save changes to database
    await _context.SaveChangesAsync();

    return response;
  }

  public async Task<ResponseGuestInvitation> AcceptInvitationAsync(Guid invitationId, AcceptInvitationRequest request)
  {
    var invitation = await _context.Invitations
        .Include(i => i.Event)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
    {
      throw new KeyNotFoundException("Invitation not found");
    }

    if (invitation.AcceptedAt != null)
    {
      throw new InvalidOperationException("Invitation has already been accepted");
    }

    // Update invitation
    invitation.AcceptedAt = DateTime.UtcNow;
    invitation.RejectedAt = null; // Clear any previous rejection
    invitation.UpdatedAt = DateTime.UtcNow;

    // Handle additional guests
    if (request.AdditionalGuests != null && request.AdditionalGuests.Any())
    {
      var additionalGuestsList = request.AdditionalGuests
          .Select(g => {
              var parts = g.Name.Split(' ', 2);
              return new AdditionalGuest { 
                  FirstName = parts.Length > 0 ? parts[0] : "",
                  LastName = parts.Length > 1 ? parts[1] : ""
              };
          })
          .ToList();
      
      invitation.AdditionalGuests = JsonSerializer.Serialize(additionalGuestsList);
      invitation.AdditionalGuestsCount = additionalGuestsList.Count();
    }

    await _context.SaveChangesAsync();

    return MapToResponse(invitation);
  }

  public async Task<ResponseGuestInvitation> DeclineInvitationAsync(Guid invitationId)
  {
    var invitation = await _context.Invitations
        .Include(i => i.Event)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
    {
      throw new KeyNotFoundException("Invitation not found");
    }

    if (invitation.RejectedAt != null)
    {
      throw new InvalidOperationException("Invitation has already been declined");
    }

    // Update invitation
    invitation.RejectedAt = DateTime.UtcNow;
    invitation.AcceptedAt = null; // Clear any previous acceptance
    invitation.UpdatedAt = DateTime.UtcNow;
    
    // Clear additional guests if any
    invitation.AdditionalGuests = "[]";
    invitation.AdditionalGuestsCount = 0;

    await _context.SaveChangesAsync();

    return MapToResponse(invitation);
  }

  private ResponseGuestInvitation MapToResponse(Invitation invitation)
  {
    var additionalGuests = new List<AdditionalGuest>();
    
    if (!string.IsNullOrEmpty(invitation.AdditionalGuests))
    {
      try
      {
        additionalGuests = JsonSerializer.Deserialize<List<AdditionalGuest>>(invitation.AdditionalGuests) ?? new List<AdditionalGuest>();
      }
      catch
      {
        // If deserialization fails, return empty list
      }
    }

    return new ResponseGuestInvitation
    {
      Id = invitation.Id,
      EventId = invitation.EventId,
      EventName = invitation.Event?.EventName ?? string.Empty,
      EventDate = invitation.Event?.EventDate,
      GuestFirstName = invitation.GuestFirstName,
      GuestLastName = invitation.GuestLastName,
      GuestEmail = invitation.GuestEmail,
      GuestPhoneNumber = invitation.GuestPhoneNumber,
      GuestPhoneCountryCode = invitation.GuestPhoneCountryCode,
      InvitedAt = invitation.InvitedAt,
      EmailSentAt = invitation.EmailSentAt,
      AcceptedAt = invitation.AcceptedAt,
      RejectedAt = invitation.RejectedAt,
      AdditionalGuestsCount = invitation.AdditionalGuestsCount,
      AdditionalGuests = additionalGuests,
      CreatedAt = invitation.CreatedAt,
      UpdatedAt = invitation.UpdatedAt
    };
  }
}
