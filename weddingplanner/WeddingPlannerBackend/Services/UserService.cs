using Microsoft.EntityFrameworkCore;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Entities;
using WeddingPlannerBackend.Models.Users;

namespace WeddingPlannerBackend.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ResponseUserProfile> GetUserProfileAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.UserEvents)
            .Include(u => u.ReceivedInvitations)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        return new ResponseUserProfile
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Phone = user.Phone,
            CreatedAt = user.CreatedAt,
            EventsCount = user.UserEvents.Count,
            InvitationsCount = user.ReceivedInvitations.Count(i => i.Status == InvitationStatus.PENDING)
        };
    }

    public async Task<ResponseUserProfile> UpdateUserAsync(Guid userId, RequestUpdateUser request)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
            throw new KeyNotFoundException("User not found");

        // Update fields if provided
        if (!string.IsNullOrEmpty(request.Name))
            user.Name = request.Name;

        if (request.Phone != null)
            user.Phone = request.Phone;

        if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
        {
            // Check if email already exists
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId);
            if (emailExists)
                throw new InvalidOperationException("Email already in use");
            
            user.Email = request.Email;
        }

        await _context.SaveChangesAsync();
        return await GetUserProfileAsync(userId);
    }

    public async Task ChangePasswordAsync(Guid userId, RequestChangePassword request)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
            throw new KeyNotFoundException("User not found");

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.HashedPassword))
            throw new UnauthorizedAccessException("Current password is incorrect");

        // Update password
        user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        
        // Revoke all refresh tokens for security
        var refreshTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId)
            .ToListAsync();
        
        _context.RefreshTokens.RemoveRange(refreshTokens);
        
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.UserEvents)
            .FirstOrDefaultAsync(u => u.Id == userId);
        
        if (user == null)
            throw new KeyNotFoundException("User not found");

        // Check if user is owner of any events
        var ownedEvents = user.UserEvents.Where(ue => ue.Role == EventRole.OWNER).ToList();
        if (ownedEvents.Any())
        {
            throw new InvalidOperationException(
                "Cannot delete account while you own events. Please transfer ownership or delete your events first.");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ResponseUserProfile>> SearchUsersAsync(RequestSearchUsers request)
    {
        var query = _context.Users.AsQueryable();

        // Apply search filter if provided
        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var searchTerm = request.Query.ToLower();
            query = query.Where(u => 
                u.Email.ToLower().Contains(searchTerm) || 
                u.Name.ToLower().Contains(searchTerm));
        }

        // Apply pagination
        var skip = (request.Page - 1) * request.PageSize;
        var users = await query
            .OrderBy(u => u.Name)
            .Skip(skip)
            .Take(request.PageSize)
            .Include(u => u.UserEvents)
            .Include(u => u.ReceivedInvitations)
            .ToListAsync();

        return users.Select(u => new ResponseUserProfile
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            Phone = u.Phone,
            CreatedAt = u.CreatedAt,
            EventsCount = u.UserEvents.Count,
            InvitationsCount = u.ReceivedInvitations.Count(i => i.Status == InvitationStatus.PENDING)
        }).ToList();
    }

    public async Task<ResponseUserProfile> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users
            .Include(u => u.UserEvents)
            .Include(u => u.ReceivedInvitations)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            throw new KeyNotFoundException("User not found");

        return new ResponseUserProfile
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Phone = user.Phone,
            CreatedAt = user.CreatedAt,
            EventsCount = user.UserEvents.Count,
            InvitationsCount = user.ReceivedInvitations.Count(i => i.Status == InvitationStatus.PENDING)
        };
    }

    public async Task<bool> CheckEmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}