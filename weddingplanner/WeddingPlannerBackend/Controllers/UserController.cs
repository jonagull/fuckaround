using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingPlannerBackend.Models.Users;
using WeddingPlannerBackend.Services;

namespace WeddingPlannerBackend.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }
        return userId;
    }

    [HttpGet("me")]
    public async Task<ActionResult<ResponseUserProfile>> GetMyProfile()
    {
        try
        {
            var userId = GetUserId();
            var result = await _userService.GetUserProfileAsync(userId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResponseUserProfile>> GetUserProfile(Guid id)
    {
        try
        {
            var result = await _userService.GetUserProfileAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("me")]
    public async Task<ActionResult<ResponseUserProfile>> UpdateMyProfile([FromBody] RequestUpdateUser request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _userService.UpdateUserAsync(userId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("me/change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] RequestChangePassword request)
    {
        try
        {
            var userId = GetUserId();
            await _userService.ChangePasswordAsync(userId, request);
            return Ok(new { message = "Password changed successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMyAccount()
    {
        try
        {
            var userId = GetUserId();
            await _userService.DeleteUserAsync(userId);
            
            // Clear the refresh token cookie
            Response.Cookies.Delete("refreshToken");
            
            return Ok(new { message = "Account deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<ResponseUserProfile>>> SearchUsers([FromQuery] RequestSearchUsers request)
    {
        try
        {
            var result = await _userService.SearchUsersAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("email/{email}")]
    public async Task<ActionResult<ResponseUserProfile>> GetUserByEmail(string email)
    {
        try
        {
            var result = await _userService.GetUserByEmailAsync(email);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("check-email")]
    [AllowAnonymous]
    public async Task<ActionResult<bool>> CheckEmailExists([FromQuery] string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { message = "Email is required" });
        }
        
        var exists = await _userService.CheckEmailExistsAsync(email);
        return Ok(new { exists });
    }
}