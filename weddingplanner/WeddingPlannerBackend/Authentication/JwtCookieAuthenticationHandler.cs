using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace WeddingPlannerBackend.Authentication;

public class JwtCookieAuthenticationHandler : AuthenticationHandler<JwtCookieAuthenticationOptions>
{
    private readonly IConfiguration _configuration;

    public JwtCookieAuthenticationHandler(
        IOptionsMonitor<JwtCookieAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IConfiguration configuration)
        : base(options, logger, encoder, clock)
    {
        _configuration = configuration;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Try to get token from Authorization header first
        string? token = null;
        
        if (Request.Headers.ContainsKey("Authorization"))
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = authHeader.Substring(7);
            }
        }

        // If no Authorization header, try to get token from cookie
        if (string.IsNullOrEmpty(token))
        {
            token = Request.Cookies["accessToken"];
        }

        // If still no token, authentication fails
        if (string.IsNullOrEmpty(token))
        {
            return AuthenticateResult.NoResult();
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);

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
            
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            return AuthenticateResult.Success(ticket);
        }
        catch (SecurityTokenExpiredException)
        {
            return AuthenticateResult.Fail("Token has expired");
        }
        catch (SecurityTokenInvalidSignatureException)
        {
            return AuthenticateResult.Fail("Invalid token signature");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Token validation failed");
            return AuthenticateResult.Fail($"Token validation failed: {ex.Message}");
        }
    }

    protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = 401;
        Response.Headers.Add("WWW-Authenticate", "Bearer");
        await Response.WriteAsync("Unauthorized");
    }

    protected override async Task HandleForbiddenAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = 403;
        await Response.WriteAsync("Forbidden");
    }
}

public class JwtCookieAuthenticationOptions : AuthenticationSchemeOptions
{
    public string? Secret { get; set; }
    public string? Issuer { get; set; }
    public string? Audience { get; set; }
}