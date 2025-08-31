namespace WeddingPlannerBackend.Services;

public interface IEmailService
{
  Task<bool> SendEmailAsync(string to, string subject, string htmlBody, string? from = null);
  Task<bool> SendWelcomeEmailAsync(string to, string userName);
  Task<bool> SendInvitationEmailAsync(string to, string eventName, string invitationUrl);
  Task<bool> SendPasswordResetEmailAsync(string to, string resetUrl);
}
