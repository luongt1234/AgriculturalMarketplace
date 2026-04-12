using AgroMarket.Application.Interfaces; // Điều chỉnh lại đường dẫn interface cho chuẩn
using AgroMarket.Application.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace AgroMarket.Infrastructure.Services
{
    public class GHNService : IGHNService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config; // Bổ sung field này để lấy cấu hình (ShopId)

        public GHNService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config; // Gán biến
            // Base address và Token được cấu hình sẵn khi register HttpClient trong Program.cs
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

        // ĐÃ IMPLEMENT: Lấy danh sách Phường/Xã
        public async Task<object> GetWardsAsync(int districtId)
        {
            var response = await _httpClient.GetAsync($"/shiip/public-api/master-data/ward?district_id={districtId}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>();
        }

        // ĐÃ IMPLEMENT: Lấy các gói dịch vụ (Chuyển phát chuẩn, Giao trong ngày...)
        public async Task<object> GetAvailableServicesAsync(int fromDistrictId, int toDistrictId)
        {
            // API lấy dịch vụ của GHN dùng method POST và cần shop_id
            int shopId = int.Parse(_config["GHNConfig:ShopId"] ?? "0");

            var payload = new
            {
                shop_id = shopId,
                from_district = fromDistrictId,
                to_district = toDistrictId
            };

            var response = await _httpClient.PostAsJsonAsync("/shiip/public-api/v2/shipping-order/available-services", payload);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object> CalculateFeeAsync(int fromDistrictId, int toDistrictId, string toWardCode, int weight, int serviceId)
        {
            int shopId = int.Parse(_config["GHNConfig:ShopId"] ?? "0");

            var payload = new
            {
                shop_id = shopId, // Thêm shop_id cho chắc chắn vì một số tài khoản GHN yêu cầu
                service_type_id = serviceId,
                from_district_id = fromDistrictId,
                to_district_id = toDistrictId,
                to_ward_code = toWardCode,
                weight = weight
            };

            var response = await _httpClient.PostAsJsonAsync("/shiip/public-api/v2/shipping-order/fee", payload);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<object>();
        }

        // ĐÃ IMPLEMENT: Tạo đơn hàng
        public async Task<object> CreateOrderAsync(object orderData)
        {
            // orderData chứa thông tin đầy đủ map với chuẩn của GHN 
            // (vd: to_name, to_phone, to_address, weight, items...)
            var response = await _httpClient.PostAsJsonAsync("/shiip/public-api/v2/shipping-order/create", orderData);

            // Nếu API bị lỗi (sai dữ liệu, thiếu trường), nó sẽ throw exception ở đây.
            // Để hệ thống xịn hơn, ở try-catch của Controller, bạn nên xử lý lỗi trả về thay vì sập app.
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<object>();
        }
    }
}