using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingPlannerBackend.Models.Address;
using WeddingPlannerBackend.Services;

namespace WeddingPlannerBackend.Controllers;

[ApiController]
[Route("api/v1/address-search")]
[Authorize]
public class AddressSearchController : ControllerBase
{
  private readonly IAddressSearchService _addressSearchService;

  public AddressSearchController(IAddressSearchService addressSearchService)
  {
    _addressSearchService = addressSearchService;
  }

  [HttpPost("search")]
  public async Task<ActionResult<List<ResponseAddressSearch>>> SearchAddress([FromBody] RequestSearchAddress request)
  {
    try
    {
      var results = await _addressSearchService.SearchAddressAsync(request);
      return Ok(results);
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "An error occurred while searching for addresses", details = ex.Message });
    }
  }

  [HttpGet("{placeId}")]
  public async Task<ActionResult<ResponseAddressSearch>> GetAddressDetails(string placeId)
  {
    try
    {
      var result = await _addressSearchService.GetAddressDetailsAsync(placeId);
      return Ok(result);
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "An error occurred while fetching address details", details = ex.Message });
    }
  }
}
