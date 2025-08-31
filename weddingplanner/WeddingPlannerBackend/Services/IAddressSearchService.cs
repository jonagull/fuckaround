using WeddingPlannerBackend.Models.Address;

namespace WeddingPlannerBackend.Services;

public interface IAddressSearchService
{
  Task<List<ResponseAddressSearch>> SearchAddressAsync(RequestSearchAddress request);
  Task<ResponseAddressSearch> GetAddressDetailsAsync(string placeId);
}
