using WeddingPlannerBackend.Models.Auth;

namespace WeddingPlannerBackend.Services;

public interface IAuthService
{
  Task<ResponseAuth> RegisterAsync(RequestRegister request);
  Task<ResponseAuth> LoginAsync(RequestLogin request);
  Task<ResponseAuth> RefreshTokenAsync(string refreshToken);
  Task RevokeRefreshTokenAsync(string refreshToken);
  Task<ResponseUser> GetUserByIdAsync(Guid userId);
  string GenerateAccessToken(Guid userId, string email);
  string GenerateRefreshToken();
}
