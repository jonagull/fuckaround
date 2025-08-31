using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace WeddingPlannerBackend.Middleware;

public class JwtCookieAuthenticationMiddleware
{
  private readonly RequestDelegate _next;
  private readonly IConfiguration _configuration;
  private readonly ILogger<JwtCookieAuthenticationMiddleware> _logger;

  public JwtCookieAuthenticationMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<JwtCookieAuthenticationMiddleware> logger)
  {
    _next = next;
    _configuration = configuration;
    _logger = logger;
  }

  public async Task InvokeAsync(HttpContext context)
  {
    // Skip authentication for non-protected endpoints
    if (!RequiresAuthentication(context))
    {
      await _next(context);
      return;
    }

    var token = GetTokenFromRequest(context);

    if (string.IsNullOrEmpty(token))
    {
      context.Response.StatusCode = 401;
      await context.Response.WriteAsync("Unauthorized: No valid token found");
      return;
    }

    try
    {
      var principal = ValidateToken(token);
      if (principal != null)
      {
        context.User = principal;
        await _next(context);
      }
      else
      {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Unauthorized: Invalid token");
      }
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Token validation failed");
      context.Response.StatusCode = 401;
      await context.Response.WriteAsync("Unauthorized: Token validation failed");
    }
  }

  private string? GetTokenFromRequest(HttpContext context)
  {
    // First, try to get token from Authorization header (for mobile and API clients)
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
      return authHeader.Substring(7);
    }

    // If no Authorization header, try to get token from cookie (for web clients)
    var tokenFromCookie = context.Request.Cookies["accessToken"];
    if (!string.IsNullOrEmpty(tokenFromCookie))
    {
      return tokenFromCookie;
    }

    return null;
  }

  private ClaimsPrincipal? ValidateToken(string token)
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);

    try
    {
      var validationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = _configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = _configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
      };

      var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
      return principal;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Token validation failed");
      return null;
    }
  }

  private bool RequiresAuthentication(HttpContext context)
  {
    var endpoint = context.GetEndpoint();
    if (endpoint == null) return false;

    // Check if the endpoint has [Authorize] attribute
    var authorizeAttribute = endpoint.Metadata.GetMetadata<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>();
    if (authorizeAttribute != null)
    {
      // Check if it also has [AllowAnonymous]
      var allowAnonymousAttribute = endpoint.Metadata.GetMetadata<Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute>();
      return allowAnonymousAttribute == null;
    }

    return false;
  }
}
