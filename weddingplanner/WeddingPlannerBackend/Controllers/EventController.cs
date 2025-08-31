using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingPlannerBackend.Models.Events;
using WeddingPlannerBackend.Services;

namespace WeddingPlannerBackend.Controllers;

[ApiController]
[Route("api/v1/events")]
[Authorize]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
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
    public async Task<ActionResult<ResponseEvent>> CreateEvent([FromBody] RequestCreateEvent request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _eventService.CreateEventAsync(userId, request);
            return CreatedAtAction(nameof(GetEvent), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResponseEvent>> GetEvent(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _eventService.GetEventByIdAsync(id, userId);
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
    }

    [HttpGet]
    public async Task<ActionResult<List<ResponseEvent>>> GetUserEvents()
    {
        try
        {
            var userId = GetUserId();
            var result = await _eventService.GetUserEventsAsync(userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ResponseEvent>> UpdateEvent(Guid id, [FromBody] RequestUpdateEvent request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _eventService.UpdateEventAsync(id, userId, request);
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
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        try
        {
            var userId = GetUserId();
            await _eventService.DeleteEventAsync(id, userId);
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
    }

    [HttpPost("{id}/users")]
    public async Task<ActionResult<ResponseUserEvent>> AddUserToEvent(Guid id, [FromBody] RequestAddUserToEvent request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _eventService.AddUserToEventAsync(id, userId, request);
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

    [HttpDelete("{id}/users/{userId}")]
    public async Task<IActionResult> RemoveUserFromEvent(Guid id, Guid userId)
    {
        try
        {
            var requesterId = GetUserId();
            await _eventService.RemoveUserFromEventAsync(id, requesterId, userId);
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

    [HttpGet("{id}/users")]
    public async Task<ActionResult<List<ResponseUserEvent>>> GetEventUsers(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _eventService.GetEventUsersAsync(id, userId);
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
    }
}