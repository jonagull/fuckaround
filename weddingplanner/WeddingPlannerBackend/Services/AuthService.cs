using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Entities;
using WeddingPlannerBackend.Models.Auth;

namespace WeddingPlannerBackend.Services;

public class AuthService : IAuthService
{
  private readonly ApplicationDbContext _context;
  private readonly IConfiguration _configuration;

  public AuthService(ApplicationDbContext context, IConfiguration configuration)
  {
    _context = context;
    _configuration = configuration;
  }

  public async Task<ResponseAuth> RegisterAsync(RequestRegister request)
  {
    // Check if user already exists
    var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (existingUser != null)
    {
      throw new InvalidOperationException("User with this email already exists");
    }

    // Create new user
    var user = new User
    {
      Email = request.Email,
      Name = request.Name,
      Phone = request.Phone,
      HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password)
    };

    _context.Users.Add(user);

    // Generate tokens
    var accessToken = GenerateAccessToken(user.Id, user.Email);
    var refreshToken = GenerateRefreshToken();

    // Save refresh token
    var refreshTokenEntity = new RefreshToken
    {
      Token = refreshToken,
      UserId = user.Id,
      ExpiresAt = DateTime.UtcNow.AddDays(7)
    };

    _context.RefreshTokens.Add(refreshTokenEntity);
    await _context.SaveChangesAsync();

    return new ResponseAuth
    {
      AccessToken = accessToken,
      RefreshToken = refreshToken,
      User = new ResponseUser
      {
        Id = user.Id,
        Email = user.Email,
        Name = user.Name,
        Phone = user.Phone
      }
    };
  }

  public async Task<ResponseAuth> LoginAsync(RequestLogin request)
  {
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

    if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.HashedPassword))
    {
      throw new UnauthorizedAccessException("Invalid email or password");
    }

    // Generate tokens
    var accessToken = GenerateAccessToken(user.Id, user.Email);
    var refreshToken = GenerateRefreshToken();

    // Save refresh token
    var refreshTokenEntity = new RefreshToken
    {
      Token = refreshToken,
      UserId = user.Id,
      ExpiresAt = DateTime.UtcNow.AddDays(7)
    };

    _context.RefreshTokens.Add(refreshTokenEntity);
    await _context.SaveChangesAsync();

    return new ResponseAuth
    {
      AccessToken = accessToken,
      RefreshToken = refreshToken,
      User = new ResponseUser
      {
        Id = user.Id,
        Email = user.Email,
        Name = user.Name,
        Phone = user.Phone
      }
    };
  }

  public async Task<ResponseAuth> RefreshTokenAsync(string refreshToken)
  {
    var tokenEntity = await _context.RefreshTokens
        .Include(rt => rt.User)
        .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

    if (tokenEntity == null || tokenEntity.ExpiresAt < DateTime.UtcNow)
    {
      throw new UnauthorizedAccessException("Invalid or expired refresh token");
    }

    // Delete old refresh token
    _context.RefreshTokens.Remove(tokenEntity);

    // Generate new tokens
    var accessToken = GenerateAccessToken(tokenEntity.User.Id, tokenEntity.User.Email);
    var newRefreshToken = GenerateRefreshToken();

    // Save new refresh token
    var newRefreshTokenEntity = new RefreshToken
    {
      Token = newRefreshToken,
      UserId = tokenEntity.UserId,
      ExpiresAt = DateTime.UtcNow.AddDays(7)
    };

    _context.RefreshTokens.Add(newRefreshTokenEntity);
    await _context.SaveChangesAsync();

    return new ResponseAuth
    {
      AccessToken = accessToken,
      RefreshToken = newRefreshToken,
      User = new ResponseUser
      {
        Id = tokenEntity.User.Id,
        Email = tokenEntity.User.Email,
        Name = tokenEntity.User.Name,
        Phone = tokenEntity.User.Phone
      }
    };
  }

  public async Task RevokeRefreshTokenAsync(string refreshToken)
  {
    var tokenEntity = await _context.RefreshTokens
        .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

    if (tokenEntity != null)
    {
      _context.RefreshTokens.Remove(tokenEntity);
      await _context.SaveChangesAsync();
    }
  }

  public async Task<ResponseUser> GetUserByIdAsync(Guid userId)
  {
    var user = await _context.Users.FindAsync(userId);

    if (user == null)
    {
      throw new KeyNotFoundException("User not found");
    }

    return new ResponseUser
    {
      Id = user.Id,
      Email = user.Email,
      Name = user.Name,
      Phone = user.Phone
    };
  }

  public string GenerateAccessToken(Guid userId, string email)
  {
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(15),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }

  public string GenerateRefreshToken()
  {
    var randomNumber = new byte[32];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomNumber);
    return Convert.ToBase64String(randomNumber);
  }
}
