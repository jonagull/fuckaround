using Resend;

namespace WeddingPlannerBackend.Services;

public class EmailService : IEmailService
{
  private readonly IResend _resend;
  private readonly IConfiguration _configuration;
  private readonly ILogger<EmailService> _logger;
  private readonly string _defaultFromEmail;

  public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
  {
    _configuration = configuration;
    _logger = logger;

    var apiKey = _configuration["Resend:ApiKey"];
    if (string.IsNullOrEmpty(apiKey))
    {
      throw new InvalidOperationException("Resend API key is not configured");
    }

    _resend = ResendClient.Create(apiKey);

    var fromEmail = _configuration["Resend:FromEmail"] ?? "noreply@omnibook.online";
    var fromName = _configuration["Resend:FromName"] ?? "Wedding Planner";
    _defaultFromEmail = $"{fromName} <{fromEmail}>";
  }

  public async Task<bool> SendEmailAsync(string to, string subject, string htmlBody, string? from = null)
  {
    try
    {
      var emailMessage = new EmailMessage
      {
        From = from ?? _defaultFromEmail,
        To = to,
        Subject = subject,
        HtmlBody = htmlBody
      };

      var response = await _resend.EmailSendAsync(emailMessage);

      if (response.Success && response.Content != null)
      {
        _logger.LogInformation("Email sent successfully to {To}. Email ID: {EmailId}", to, response.Content);
        return true;
      }

      _logger.LogError("Failed to send email to {To}", to);
      return false;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Error sending email to {To}", to);
      return false;
    }
  }

  public async Task<bool> SendWelcomeEmailAsync(string to, string userName)
  {
    var htmlBody = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }}
                    .content {{ padding: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Welcome to Wedding Planner!</h1>
                    </div>
                    <div class='content'>
                        <p>Hi {userName},</p>
                        <p>Thank you for joining Wedding Planner! We're excited to help you plan your perfect wedding.</p>
                        <p>Get started by creating your first event and inviting your guests.</p>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <p>Best regards,<br>The Wedding Planner Team</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 Wedding Planner. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>";

    return await SendEmailAsync(to, "Welcome to Wedding Planner!", htmlBody);
  }

  public async Task<bool> SendInvitationEmailAsync(string to, string eventName, string invitationUrl)
  {
    var htmlBody = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }}
                    .content {{ padding: 20px 0; }}
                    .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>You're Invited!</h1>
                    </div>
                    <div class='content'>
                        <p>You've been invited to {eventName}!</p>
                        <p>Click the link below to view the invitation and RSVP:</p>
                        <p style='text-align: center; margin: 30px 0;'>
                            <a href='{invitationUrl}' class='button'>View Invitation</a>
                        </p>
                        <p>Or copy this link: {invitationUrl}</p>
                        <p>We hope to see you there!</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 Wedding Planner. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>";

    return await SendEmailAsync(to, $"You're invited to {eventName}!", htmlBody);
  }

  public async Task<bool> SendPasswordResetEmailAsync(string to, string resetUrl)
  {
    var htmlBody = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }}
                    .content {{ padding: 20px 0; }}
                    .button {{ display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class='content'>
                        <p>We received a request to reset your password.</p>
                        <p>If you didn't make this request, you can safely ignore this email.</p>
                        <p>To reset your password, click the link below:</p>
                        <p style='text-align: center; margin: 30px 0;'>
                            <a href='{resetUrl}' class='button'>Reset Password</a>
                        </p>
                        <p>Or copy this link: {resetUrl}</p>
                        <p>This link will expire in 1 hour for security reasons.</p>
                        <p>Best regards,<br>The Wedding Planner Team</p>
                    </div>
                    <div class='footer'>
                        <p>© 2024 Wedding Planner. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>";

    return await SendEmailAsync(to, "Password Reset Request", htmlBody);
  }
}
