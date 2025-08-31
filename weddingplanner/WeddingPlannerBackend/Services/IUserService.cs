using WeddingPlannerBackend.Models.Users;

namespace WeddingPlannerBackend.Services;

public interface IUserService
{
  Task<ResponseUserProfile> GetUserProfileAsync(Guid userId);
  Task<ResponseUserProfile> UpdateUserAsync(Guid userId, RequestUpdateUser request);
  Task ChangePasswordAsync(Guid userId, RequestChangePassword request);
  Task DeleteUserAsync(Guid userId);
  Task<List<ResponseUserProfile>> SearchUsersAsync(RequestSearchUsers request);
  Task<ResponseUserProfile> GetUserByEmailAsync(string email);
  Task<bool> CheckEmailExistsAsync(string email);
}
