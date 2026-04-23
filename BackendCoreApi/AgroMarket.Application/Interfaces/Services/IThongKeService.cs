using AgroMarket.Application.DTOs.ThongKe;
using System;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IThongKeService
    {
        Task<FarmerDashboardStatsDto> GetFarmerStatsAsync(Guid farmerId);
        Task<AdminDashboardStatsDto> GetAdminStatsAsync();
    }
}
