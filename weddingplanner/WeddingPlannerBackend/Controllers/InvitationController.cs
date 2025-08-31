using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingPlannerBackend.Models.Invitations;
using WeddingPlannerBackend.Services;

namespace WeddingPlannerBackend.Controllers;

[ApiController]
[Route("api/v1/invitations")]
[Authorize]
public class InvitationController : ControllerBase
{
  private readonly IInvitationService _invitationService;

  public InvitationController(IInvitationService invitationService)
  {
    _invitationService = invitationService;
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

  [HttpPost("event/{eventId}")]
  public async Task<ActionResult<ResponseInvitation>> SendInvitation(Guid eventId, [FromBody] RequestSendInvitation request)
  {
    try
    {
      var userId = GetUserId();
      var result = await _invitationService.SendInvitationAsync(eventId, userId, request);
      return Ok(result);
    }
    catch (KeyNotFoundException ex)
    {
      return NotFound(new { message = ex.Message });
    }
    catch (UnauthorizedAccessException ex)
    {
      return Forbid(ex.Message);
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id}/accept")]
  public async Task<ActionResult<ResponseInvitation>> AcceptInvitation(Guid id)
  {
    try
    {
      var userId = GetUserId();
      var result = await _invitationService.AcceptInvitationAsync(id, userId);
      return Ok(result);
    }
    catch (KeyNotFoundException ex)
    {
      return NotFound(new { message = ex.Message });
    }
    catch (UnauthorizedAccessException ex)
    {
      return Forbid(ex.Message);
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id}/reject")]
  public async Task<ActionResult<ResponseInvitation>> RejectInvitation(Guid id)
  {
    try
    {
      var userId = GetUserId();
      var result = await _invitationService.RejectInvitationAsync(id, userId);
      return Ok(result);
    }
    catch (KeyNotFoundException ex)
    {
      return NotFound(new { message = ex.Message });
    }
    catch (UnauthorizedAccessException ex)
    {
      return Forbid(ex.Message);
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet]
  public async Task<ActionResult<List<ResponseInvitation>>> GetMyInvitations()
  {
    try
    {
      var userId = GetUserId();
      var result = await _invitationService.GetUserInvitationsAsync(userId);
      return Ok(result);
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("event/{eventId}")]
  public async Task<ActionResult<List<ResponseInvitation>>> GetEventInvitations(Guid eventId)
  {
    try
    {
      var userId = GetUserId();
      var result = await _invitationService.GetEventInvitationsAsync(eventId, userId);
      return Ok(result);
    }
    catch (UnauthorizedAccessException ex)
    {
      return Forbid(ex.Message);
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> CancelInvitation(Guid id)
  {
    try
    {
      var userId = GetUserId();
      await _invitationService.CancelInvitationAsync(id, userId);
      return NoContent();
    }
    catch (KeyNotFoundException ex)
    {
      return NotFound(new { message = ex.Message });
    }
    catch (UnauthorizedAccessException ex)
    {
      return Forbid(ex.Message);
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("available-roles")]
  public IActionResult GetAvailableRoles()
  {
    var roles = Enum.GetNames(typeof(WeddingPlannerBackend.Entities.EventRole)).ToList();
    return Ok(new { roles });
  }
}
