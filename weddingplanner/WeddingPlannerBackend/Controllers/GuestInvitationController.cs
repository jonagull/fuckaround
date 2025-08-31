using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingPlannerBackend.Models.GuestInvitations;
using WeddingPlannerBackend.Services;
using System.Globalization;
using System.Text;

namespace WeddingPlannerBackend.Controllers;

[ApiController]
[Route("api/v1/guest-invitations")]
[Authorize]
public class GuestInvitationController : ControllerBase
{
    private readonly IGuestInvitationService _guestInvitationService;

    public GuestInvitationController(IGuestInvitationService guestInvitationService)
    {
        _guestInvitationService = guestInvitationService;
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

    [HttpPost]
    public async Task<ActionResult<ResponseGuestInvitation>> CreateInvitation([FromBody] RequestCreateGuestInvitation request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _guestInvitationService.CreateInvitationAsync(userId, request);
            return CreatedAtAction(nameof(GetInvitation), new { id = result.Id }, result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
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

    [HttpPost("bulk")]
    public async Task<ActionResult<ResponseBulkCreateInvitations>> BulkCreateInvitations([FromBody] List<RequestCreateGuestInvitation> requests)
    {
        try
        {
            var userId = GetUserId();
            var result = await _guestInvitationService.BulkCreateInvitationsAsync(userId, requests);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    [AllowAnonymous] // Allow public access to view invitation
    public async Task<ActionResult<ResponseGuestInvitation>> GetInvitation(Guid id)
    {
        try
        {
            var result = await _guestInvitationService.GetInvitationByIdAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<List<ResponseGuestInvitation>>> GetEventInvitations(Guid eventId)
    {
        try
        {
            var userId = GetUserId();
            var result = await _guestInvitationService.GetEventInvitationsAsync(eventId, userId);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<ResponseGuestInvitation>> UpdateInvitation(Guid id, [FromBody] RequestUpdateGuestInvitation request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _guestInvitationService.UpdateInvitationAsync(id, userId, request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvitation(Guid id)
    {
        try
        {
            var userId = GetUserId();
            await _guestInvitationService.DeleteInvitationAsync(id, userId);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/accept")]
    [AllowAnonymous] // Allow public access to accept invitation
    public async Task<ActionResult<ResponseGuestInvitation>> AcceptInvitation(Guid id, [FromBody] AcceptInvitationRequest request)
    {
        try
        {
            var result = await _guestInvitationService.AcceptInvitationAsync(id, request);
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

    [HttpPost("{id}/decline")]
    [AllowAnonymous] // Allow public access to decline invitation
    public async Task<ActionResult<ResponseGuestInvitation>> DeclineInvitation(Guid id)
    {
        try
        {
            var result = await _guestInvitationService.DeclineInvitationAsync(id);
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

    [HttpPost("send-invitations")]
    public async Task<ActionResult<SendInvitationsResponse>> SendInvitations([FromBody] SendInvitationsRequest request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _guestInvitationService.SendInvitationsAsync(userId, request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
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

    [HttpPost("parse-csv")]
    public async Task<ActionResult<List<CsvGuestInfo>>> ParseCsvGuests([FromForm] RequestParseCsvGuests request)
    {
        try
        {
            if (request.CsvFile == null || request.CsvFile.Length == 0)
            {
                return BadRequest(new { message = "CSV file is required" });
            }

            if (!request.CsvFile.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "File must be a CSV file" });
            }

            var guests = new List<CsvGuestInfo>();

            using var reader = new StreamReader(request.CsvFile.OpenReadStream(), Encoding.UTF8);
            var isFirstLine = true;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line)) continue;

                // Skip header row
                if (isFirstLine)
                {
                    isFirstLine = false;
                    continue;
                }

                var columns = ParseCsvLine(line);
                if (columns.Length >= 5) // Minimum required columns
                {
                    var guest = new CsvGuestInfo
                    {
                        FirstName = columns[0].Trim(),
                        LastName = columns[1].Trim(),
                        Email = columns[2].Trim(),
                        PhoneNumber = columns[3].Trim(),
                        PhoneCountryCode = columns[4].Trim(),
                        AdditionalGuestsCount = columns.Length > 5 && int.TryParse(columns[5].Trim(), out var additional) ? additional : 0
                    };

                    guests.Add(guest);
                }
            }

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Error parsing CSV file: {ex.Message}" });
        }
    }

    private string[] ParseCsvLine(string line)
    {
        var result = new List<string>();
        var current = new StringBuilder();
        var inQuotes = false;

        for (int i = 0; i < line.Length; i++)
        {
            var ch = line[i];

            if (ch == '"')
            {
                inQuotes = !inQuotes;
            }
            else if (ch == ',' && !inQuotes)
            {
                result.Add(current.ToString());
                current.Clear();
            }
            else
            {
                current.Append(ch);
            }
        }

        result.Add(current.ToString());
        return result.ToArray();
    }

    [HttpPost("bulk-from-csv")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResponseBulkCreateInvitations>> BulkCreateInvitationsFromCsv([FromForm] BulkCreateFromCsvRequest request)
    {
        try
        {
            if (request.CsvFile == null || request.CsvFile.Length == 0)
            {
                return BadRequest(new { message = "CSV file is required" });
            }

            if (!request.CsvFile.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "File must be a CSV file" });
            }

            var invitationRequests = new List<RequestCreateGuestInvitation>();

            using var reader = new StreamReader(request.CsvFile.OpenReadStream(), Encoding.UTF8);
            var isFirstLine = true;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line)) continue;

                // Skip header row
                if (isFirstLine)
                {
                    isFirstLine = false;
                    continue;
                }

                var columns = ParseCsvLine(line);
                if (columns.Length >= 5) // Minimum required columns
                {
                    var invitationRequest = new RequestCreateGuestInvitation
                    {
                        EventId = request.EventId,
                        GuestInfo = new GuestInfo
                        {
                            FirstName = columns[0].Trim(),
                            LastName = columns[1].Trim(),
                            Email = columns[2].Trim(),
                            PhoneNumber = columns[3].Trim(),
                            PhoneCountryCode = columns[4].Trim()
                        },
                        AdditionalGuestsCount = columns.Length > 5 && int.TryParse(columns[5].Trim(), out var additional) ? additional : 0
                    };

                    invitationRequests.Add(invitationRequest);
                }
            }

            var userId = GetUserId();
            var result = await _guestInvitationService.BulkCreateInvitationsAsync(userId, invitationRequests);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Error processing CSV file: {ex.Message}" });
        }
    }
}