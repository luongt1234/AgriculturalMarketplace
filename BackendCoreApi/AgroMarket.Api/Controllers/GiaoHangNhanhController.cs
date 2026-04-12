using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using AgroMarket.Application.Interfaces;
using AgroMarket.Application.Interfaces.Repositories;

namespace AgroMarket.Api.Controllers
{
    [ApiController]
    [Route("api/shipping/ghn")]
    public class GiaoHangNhanhController : BaseController
    {
        private readonly IGHNService _ghnService;
        private readonly IMemoryCache _cache;

        public GiaoHangNhanhController(IGHNService ghnService, IMemoryCache cache)
        {
            _ghnService = ghnService;
            _cache = cache;
        }

        // GET: api/shipping/ghn/provinces
        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            if (!_cache.TryGetValue("GHN_Provinces", out object provinces))
            {
                provinces = await _ghnService.GetProvincesAsync();

                _cache.Set("GHN_Provinces", provinces, TimeSpan.FromHours(24));
            }
            return Ok(provinces);
        }

        // GET: api/shipping/ghn/districts/{provinceId}
        [HttpGet("districts/{provinceId}")]
        public async Task<IActionResult> GetDistricts(int provinceId)
        {
            string cacheKey = $"GHN_Districts_{provinceId}";
            if (!_cache.TryGetValue(cacheKey, out object districts))
            {
                districts = await _ghnService.GetDistrictsAsync(provinceId);
                _cache.Set(cacheKey, districts, TimeSpan.FromHours(24));
            }
            return Ok(districts);
        }

        // GET: api/shipping/ghn/wards/{districtId}
        [HttpGet("wards/{districtId}")]
        public async Task<IActionResult> GetWards(int districtId)
        {
            string cacheKey = $"GHN_Wards_{districtId}";
            if (!_cache.TryGetValue(cacheKey, out object wards))
            {
                wards = await _ghnService.GetWardsAsync(districtId);
                _cache.Set(cacheKey, wards, TimeSpan.FromHours(24));
            }
            return Ok(wards);
        }

        // GET: api/shipping/ghn/services
        [HttpGet("services")]
        public async Task<IActionResult> GetAvailableServices([FromQuery] int fromDistrict, [FromQuery] int toDistrict)
        {
            var services = await _ghnService.GetAvailableServicesAsync(fromDistrict, toDistrict);
            return Ok(services);
        }

        // POST: api/shipping/ghn/calculate-fee
        [HttpPost("calculate-fee")]
        public async Task<IActionResult> CalculateFee([FromBody] CalculateFeeRequest request)
        {
            try
            {
                var fee = await _ghnService.CalculateFeeAsync(
                    request.FromDistrictId,
                    request.ToDistrictId,
                    request.ToWardCode,
                    request.Weight,
                    request.ServiceId
                );
                return Ok(fee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Không thể tính phí vận chuyển GHN lúc này.", Details = ex.Message });
            }
        }
    }

    public class CalculateFeeRequest
    {
        public int FromDistrictId { get; set; }
        public int ToDistrictId { get; set; }
        public string ToWardCode { get; set; } = null!;
        public int Weight { get; set; }
        public int ServiceId { get; set; } = 2;
    }
}