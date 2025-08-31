using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingPlannerBackend.Models.Auth;
using WeddingPlannerBackend.Services;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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

    // ===== CURRENT USER ENDPOINT =====
    
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ResponseUser>> GetCurrentUser()
    {
        try
        {
            var userId = GetUserId();
            var user = await _authService.GetUserByIdAsync(userId);
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    // ===== WEB ENDPOINTS =====
    // These endpoints set refresh token in httpOnly cookie and return only accessToken

    [HttpPost("web/register")]
    public async Task<ActionResult<ResponseAuthWeb>> RegisterWeb([FromBody] RequestRegister request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            
            // Set both tokens in httpOnly cookies
            Response.Cookies.Append("accessToken", result.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Only require HTTPS in production
                SameSite = SameSiteMode.Lax, // Changed to Lax for development
                Expires = DateTime.UtcNow.AddMinutes(15) // Access token expires in 15 minutes
            });
            
            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Only require HTTPS in production
                SameSite = SameSiteMode.Lax, // Changed to Lax for development
                Expires = DateTime.UtcNow.AddDays(7)
            });
            
            // Return only user info (tokens are in cookies)
            return Ok(new ResponseAuthWeb
            {
                AccessToken = result.AccessToken, // Still return it for backward compatibility
                User = result.User
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("web/login")]
    public async Task<ActionResult<ResponseAuthWeb>> LoginWeb([FromBody] RequestLogin request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            
            // Set both tokens in httpOnly cookies
            Response.Cookies.Append("accessToken", result.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Only require HTTPS in production
                SameSite = SameSiteMode.Lax, // Changed to Lax for development
                Expires = DateTime.UtcNow.AddMinutes(15) // Access token expires in 15 minutes
            });
            
            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Only require HTTPS in production
                SameSite = SameSiteMode.Lax, // Changed to Lax for development
                Expires = DateTime.UtcNow.AddDays(7)
            });
            
            // Return only user info (tokens are in cookies)
            return Ok(new ResponseAuthWeb
            {
                AccessToken = result.AccessToken, // Still return it for backward compatibility
                User = result.User
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("web/refresh")]
    public async Task<ActionResult<ResponseAuthWeb>> RefreshTokenWeb()
    {
        try
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "No refresh token provided" });
            }

            var result = await _authService.RefreshTokenAsync(refreshToken);
            
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            
            // Set both new tokens in httpOnly cookies
            Response.Cookies.Append("accessToken", result.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Only require HTTPS in production
                SameSite = SameSiteMode.Lax, // Changed to Lax for development
                Expires = DateTime.UtcNow.AddMinutes(15) // Access token expires in 15 minutes
            });
            
            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Only require HTTPS in production
                SameSite = SameSiteMode.Lax, // Changed to Lax for development
                Expires = DateTime.UtcNow.AddDays(7)
            });
            
            // Return only user info (tokens are in cookies)
            return Ok(new ResponseAuthWeb
            {
                AccessToken = result.AccessToken, // Still return it for backward compatibility
                User = result.User
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("web/logout")]
    public async Task<IActionResult> LogoutWeb()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.RevokeRefreshTokenAsync(refreshToken);
        }
        
        // Clear both cookies
        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");
        
        return Ok(new { message = "Logged out successfully" });
    }

    // ===== MOBILE ENDPOINTS =====
    // These endpoints return both accessToken and refreshToken in response body

    [HttpPost("mobile/register")]
    public async Task<ActionResult<ResponseAuthMobile>> RegisterMobile([FromBody] RequestRegister request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            
            // Return both tokens in response body for mobile
            return Ok(new ResponseAuthMobile
            {
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                User = result.User
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("mobile/login")]
    public async Task<ActionResult<ResponseAuthMobile>> LoginMobile([FromBody] RequestLogin request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            
            // Return both tokens in response body for mobile
            return Ok(new ResponseAuthMobile
            {
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                User = result.User
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("mobile/refresh")]
    public async Task<ActionResult<ResponseAuthMobile>> RefreshTokenMobile([FromBody] RequestRefreshMobile request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return Unauthorized(new { message = "No refresh token provided" });
            }

            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            
            // Return both tokens in response body for mobile
            return Ok(new ResponseAuthMobile
            {
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                User = result.User
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("mobile/logout")]
    public async Task<IActionResult> LogoutMobile([FromBody] RequestRefreshMobile request)
    {
        if (!string.IsNullOrEmpty(request.RefreshToken))
        {
            await _authService.RevokeRefreshTokenAsync(request.RefreshToken);
        }
        
        return Ok(new { message = "Logged out successfully" });
    }

    // ===== LEGACY/BACKWARD COMPATIBILITY ENDPOINTS =====
    // Keep these for backward compatibility if needed

    [HttpPost("register")]
    public async Task<ActionResult<ResponseAuthWeb>> Register([FromBody] RequestRegister request)
    {
        // Default to web behavior for backward compatibility
        return await RegisterWeb(request);
    }

    [HttpPost("login")]
    public async Task<ActionResult<ResponseAuthWeb>> Login([FromBody] RequestLogin request)
    {
        // Default to web behavior for backward compatibility
        return await LoginWeb(request);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ResponseAuthWeb>> RefreshToken()
    {
        // Default to web behavior for backward compatibility
        return await RefreshTokenWeb();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // Default to web behavior for backward compatibility
        return await LogoutWeb();
    }
}