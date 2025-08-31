using Microsoft.EntityFrameworkCore;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Entities;
using WeddingPlannerBackend.Models.Invitations;

namespace WeddingPlannerBackend.Services;

public class InvitationService : IInvitationService
{
  private readonly ApplicationDbContext _context;

  public InvitationService(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<ResponseInvitation> SendInvitationAsync(Guid eventId, Guid senderId, RequestSendInvitation request)
  {
    // Check if event exists and sender is owner
    var eventEntity = await _context.Events
        .Include(e => e.Planners)
        .FirstOrDefaultAsync(e => e.Id == eventId);

    if (eventEntity == null)
      throw new KeyNotFoundException("Event not found");

    var isOwner = eventEntity.Planners.Any(p => p.UserId == senderId && p.Role == EventRole.OWNER);
    if (!isOwner)
      throw new UnauthorizedAccessException("Only event owners can send invitations");

    // Find receiver by email
    var receiver = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.ReceiverEmail);
    if (receiver == null)
      throw new KeyNotFoundException("User not found");

    // Check if user already in event
    if (eventEntity.Planners.Any(p => p.UserId == receiver.Id))
      throw new InvalidOperationException("User is already part of this event");

    // Check if invitation already exists
    var existingInvitation = await _context.PlannerInvitations
        .FirstOrDefaultAsync(i => i.EventId == eventId && i.ReceiverId == receiver.Id && i.Status == InvitationStatus.PENDING);

    if (existingInvitation != null)
      throw new InvalidOperationException("Invitation already sent to this user");

    var sender = await _context.Users.FindAsync(senderId);

    var invitation = new PlannerInvitation
    {
      EventId = eventId,
      SenderId = senderId,
      ReceiverId = receiver.Id,
      Role = request.Role,
      Message = request.Message,
      Status = InvitationStatus.PENDING,
      ExpiresAt = DateTime.UtcNow.AddDays(7)
    };

    _context.PlannerInvitations.Add(invitation);
    await _context.SaveChangesAsync();

    return new ResponseInvitation
    {
      Id = invitation.Id,
      EventId = eventId,
      EventName = eventEntity.EventName,
      SenderId = senderId,
      SenderName = sender!.Name,
      SenderEmail = sender.Email,
      ReceiverId = receiver.Id,
      ReceiverName = receiver.Name,
      ReceiverEmail = receiver.Email,
      Role = invitation.Role,
      Status = invitation.Status,
      Message = invitation.Message,
      ExpiresAt = invitation.ExpiresAt,
      CreatedAt = invitation.CreatedAt
    };
  }

  public async Task<ResponseInvitation> AcceptInvitationAsync(Guid invitationId, Guid userId)
  {
    var invitation = await _context.PlannerInvitations
        .Include(i => i.Event)
        .Include(i => i.Sender)
        .Include(i => i.Receiver)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
      throw new KeyNotFoundException("Invitation not found");

    if (invitation.ReceiverId != userId)
      throw new UnauthorizedAccessException("This invitation is not for you");

    if (invitation.Status != InvitationStatus.PENDING)
      throw new InvalidOperationException("Invitation has already been processed");

    if (invitation.ExpiresAt < DateTime.UtcNow)
      throw new InvalidOperationException("Invitation has expired");

    // Update invitation status
    invitation.Status = InvitationStatus.ACCEPTED;
    invitation.UpdatedAt = DateTime.UtcNow;

    // Add user to event
    var userEvent = new UserEvent
    {
      EventId = invitation.EventId,
      UserId = userId,
      Role = invitation.Role,
      StringRole = invitation.Role.ToString()
    };

    _context.UserEvents.Add(userEvent);
    await _context.SaveChangesAsync();

    return MapToResponseInvitation(invitation);
  }

  public async Task<ResponseInvitation> RejectInvitationAsync(Guid invitationId, Guid userId)
  {
    var invitation = await _context.PlannerInvitations
        .Include(i => i.Event)
        .Include(i => i.Sender)
        .Include(i => i.Receiver)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
      throw new KeyNotFoundException("Invitation not found");

    if (invitation.ReceiverId != userId)
      throw new UnauthorizedAccessException("This invitation is not for you");

    if (invitation.Status != InvitationStatus.PENDING)
      throw new InvalidOperationException("Invitation has already been processed");

    invitation.Status = InvitationStatus.REJECTED;
    invitation.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return MapToResponseInvitation(invitation);
  }

  public async Task<ResponseListPlannerInvitations> GetUserInvitationsAsync(Guid userId)
  {
    var sentInvitations = await _context.PlannerInvitations
        .Include(i => i.Event)
            .ThenInclude(e => e.VenueAddress)
        .Include(i => i.Sender)
        .Include(i => i.Receiver)
        .Where(i => i.SenderId == userId && i.Status == InvitationStatus.PENDING)
        .OrderByDescending(i => i.CreatedAt)
        .ToListAsync();

    var receivedInvitations = await _context.PlannerInvitations
        .Include(i => i.Event)
            .ThenInclude(e => e.VenueAddress)
        .Include(i => i.Sender)
        .Include(i => i.Receiver)
        .Where(i => i.ReceiverId == userId && i.Status == InvitationStatus.PENDING)
        .OrderByDescending(i => i.CreatedAt)
        .ToListAsync();

    return new ResponseListPlannerInvitations
    {
        Sent = sentInvitations.Select(MapToResponseInvitationWithRelations).ToList(),
        Received = receivedInvitations.Select(MapToResponseInvitationWithRelations).ToList()
    };
  }

  public async Task<List<ResponseInvitation>> GetEventInvitationsAsync(Guid eventId, Guid userId)
  {
    // Check if user has access to event
    var hasAccess = await _context.UserEvents
        .AnyAsync(ue => ue.EventId == eventId && ue.UserId == userId && ue.Role == EventRole.OWNER);

    if (!hasAccess)
      throw new UnauthorizedAccessException("Only event owners can view invitations");

    var invitations = await _context.PlannerInvitations
        .Include(i => i.Event)
        .Include(i => i.Sender)
        .Include(i => i.Receiver)
        .Where(i => i.EventId == eventId)
        .OrderByDescending(i => i.CreatedAt)
        .ToListAsync();

    return invitations.Select(MapToResponseInvitation).ToList();
  }

  public async Task CancelInvitationAsync(Guid invitationId, Guid userId)
  {
    var invitation = await _context.PlannerInvitations
        .Include(i => i.Event)
            .ThenInclude(e => e.Planners)
        .FirstOrDefaultAsync(i => i.Id == invitationId);

    if (invitation == null)
      throw new KeyNotFoundException("Invitation not found");

    // Check if user is the sender or event owner
    var isOwner = invitation.Event.Planners.Any(p => p.UserId == userId && p.Role == EventRole.OWNER);
    if (invitation.SenderId != userId && !isOwner)
      throw new UnauthorizedAccessException("You can only cancel invitations you sent or if you're the event owner");

    if (invitation.Status != InvitationStatus.PENDING)
      throw new InvalidOperationException("Can only cancel pending invitations");

    _context.PlannerInvitations.Remove(invitation);
    await _context.SaveChangesAsync();
  }

  private ResponseInvitation MapToResponseInvitation(PlannerInvitation invitation)
  {
    return new ResponseInvitation
    {
      Id = invitation.Id,
      EventId = invitation.EventId,
      EventName = invitation.Event.EventName,
      SenderId = invitation.SenderId,
      SenderName = invitation.Sender.Name,
      SenderEmail = invitation.Sender.Email,
      ReceiverId = invitation.ReceiverId,
      ReceiverName = invitation.Receiver.Name,
      ReceiverEmail = invitation.Receiver.Email,
      Role = invitation.Role,
      Status = invitation.Status,
      Message = invitation.Message,
      ExpiresAt = invitation.ExpiresAt,
      CreatedAt = invitation.CreatedAt
    };
  }

  private ResponseInvitationWithRelations MapToResponseInvitationWithRelations(PlannerInvitation invitation)
  {
    return new ResponseInvitationWithRelations
    {
      Id = invitation.Id.ToString(),
      EventId = invitation.EventId.ToString(),
      Event = new EventInfo
      {
        Id = invitation.Event.Id.ToString(),
        EventName = invitation.Event.EventName,
        EventDate = invitation.Event.EventDate,
        Location = invitation.Event.VenueAddress?.Street,
        Description = invitation.Event.EventDescription
      },
      Sender = new UserInfo
      {
        Id = invitation.Sender.Id.ToString(),
        Name = invitation.Sender.Name,
        Email = invitation.Sender.Email
      },
      Receiver = new UserInfo
      {
        Id = invitation.Receiver.Id.ToString(),
        Name = invitation.Receiver.Name,
        Email = invitation.Receiver.Email
      },
      Role = invitation.Role.ToString(),
      Status = invitation.Status.ToString(),
      Message = invitation.Message,
      ExpiresAt = invitation.ExpiresAt,
      CreatedAt = invitation.CreatedAt
    };
  }
}
