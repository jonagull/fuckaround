using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WeddingPlannerBackend.Authentication;
using WeddingPlannerBackend.Data;
using WeddingPlannerBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Authentication with custom handler that supports both Bearer tokens and cookies
builder.Services.AddAuthentication("JwtCookie")
    .AddScheme<JwtCookieAuthenticationOptions, JwtCookieAuthenticationHandler>("JwtCookie", options =>
    {
        options.Secret = builder.Configuration["Jwt:Secret"];
        options.Issuer = builder.Configuration["Jwt:Issuer"];
        options.Audience = builder.Configuration["Jwt:Audience"];
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowWebApp",
      policy =>
    {
      policy.WithOrigins("http://localhost:3050", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IInvitationService, InvitationService>();
builder.Services.AddScoped<IGuestInvitationService, GuestInvitationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHttpClient<IAddressSearchService, AddressSearchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowWebApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
