using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Api.Attributes;
using AgroMarket.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    [Authorize]
    public class ThongKeController : BaseController
    {
        private readonly IThongKeService _thongKeService;

        public ThongKeController(IThongKeService thongKeService)
        {
            _thongKeService = thongKeService;
        }

        [HttpGet("farmer-dashboard")]
        public async Task<IActionResult> GetFarmerDashboardStats()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Error("Không tìm thấy thông tin nông dân", 401);

                var stats = await _thongKeService.GetFarmerStatsAsync(userId);
                return Success(stats);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy thống kê nông dân: {ex.Message}");
            }
        }

        [HttpGet("admin-dashboard")]
        [RequireAdminPermission(AdminFeaturePermission.Dashboard)]
        public async Task<IActionResult> GetAdminDashboardStats()
        {
            try
            {
                var stats = await _thongKeService.GetAdminStatsAsync();
                return Success(stats);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy thống kê hệ thống: {ex.Message}");
            }
        }
    }
}
