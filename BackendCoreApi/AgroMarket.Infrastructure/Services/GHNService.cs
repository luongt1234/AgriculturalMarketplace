using AgroMarket.Application.DTOs.GiaoHangNhanhDtos;
using AgroMarket.Application.Interfaces;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Wrappers;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace AgroMarket.Infrastructure.Services
{
    public class GHNService : IGHNService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GHNService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;

            if (_httpClient.BaseAddress == null)
            {
                _httpClient.BaseAddress = new Uri(_configuration["GHNConfig:BaseUrl"]);
                _httpClient.DefaultRequestHeaders.Add("Token", _configuration["GHNConfig:Token"]);
            }
        }

        public async Task<object> GetProvincesAsync()
        {
            var response = await _httpClient.GetAsync("/shiip/public-api/master-data/province");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object> GetDistrictsAsync(int provinceId)
        {
            var response = await _httpClient.GetAsync($"/shiip/public-api/master-data/district?province_id={provinceId}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object> GetWardsAsync(int districtId)
        {
            var response = await _httpClient.GetAsync($"/shiip/public-api/master-data/ward?district_id={districtId}");

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Lỗi GHN GetWardsAsync (DistrictID: {districtId}): {errorContent}");
            }

            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object> GetAvailableServicesAsync(int fromDistrictId, int toDistrictId)
        {
            int shopId = int.Parse(_configuration["GHNConfig:ShopId"] ?? "0");

            var payload = new
            {
                shop_id = shopId,
                from_district = fromDistrictId,
                to_district = toDistrictId
            };

            var response = await _httpClient.PostAsJsonAsync("/shiip/public-api/v2/shipping-order/available-services", payload);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadFromJsonAsync<object>();
            return result;
        }

        public async Task<object> CalculateFeeAsync(int fromDistrictId, int toDistrictId, string toWardCode, int weight, int serviceId)
        {
            int shopId = int.Parse(_configuration["GHNConfig:ShopId"] ?? "0");

            if (weight > 50000)
                throw new Exception("Đơn hàng có khối lượng lớn, vui lòng thương lượng với người bán.");

            int autoServiceTypeId = weight <= 20000 ? 2 : 5;

            var payload = new
            {
                shop_id = shopId,
                service_type_id = autoServiceTypeId,
                from_district_id = fromDistrictId,
                to_district_id = toDistrictId,
                to_ward_code = toWardCode,
                weight = weight
            };

            var response = await _httpClient.PostAsJsonAsync("/shiip/public-api/v2/shipping-order/fee", payload);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>();
        }

        // Đẩy đơn lên GHN và lấy mã vận đơn
        public async Task<ShippingOrderResponse> CreateShippingOrderAsync(object orderData)
        {
            try
            {
                // Truyền thêm Header ShopId vì API này bắt buộc
                _httpClient.DefaultRequestHeaders.Remove("ShopId");
                _httpClient.DefaultRequestHeaders.Add("ShopId", _configuration["GHNConfig:ShopId"]);

                var response = await _httpClient.PostAsJsonAsync("/shiip/public-api/v2/shipping-order/create", orderData);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<GhnSuccessResponse>();
                    return new ShippingOrderResponse
                    {
                        IsSuccess = true,
                        TrackingCode = result?.Data?.Order_code,
                        Message = "Tạo đơn Giao Hàng Nhanh thành công."
                    };
                }

                var errorResult = await response.Content.ReadAsStringAsync();
                return new ShippingOrderResponse { IsSuccess = false, Message = $"Lỗi từ GHN: {errorResult}" };
            }
            catch (Exception ex)
            {
                return new ShippingOrderResponse { IsSuccess = false, Message = $"Lỗi kết nối: {ex.Message}" };
            }
        }

        public Task<object> CreateOrderAsync(object orderData)
        {
            throw new NotImplementedException();
        }
    }
}