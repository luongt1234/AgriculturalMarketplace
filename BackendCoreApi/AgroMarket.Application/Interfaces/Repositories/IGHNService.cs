using AgroMarket.Application.DTOs.GiaoHangNhanhDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IGHNService
    {
        Task<object> GetProvincesAsync();
        Task<object> GetDistrictsAsync(int provinceId);
        Task<object> GetWardsAsync(int districtId);
        Task<object> GetAvailableServicesAsync(int fromDistrictId, int toDistrictId);

        // 2. Nghiệp vụ vận chuyển
        Task<object> CalculateFeeAsync(int fromDistrictId, int toDistrictId, string toWardCode, int weight, int serviceId);
        Task<object> CreateOrderAsync(object orderData);
        Task<ShippingOrderResponse> CreateShippingOrderAsync(object orderData);
    }
}
