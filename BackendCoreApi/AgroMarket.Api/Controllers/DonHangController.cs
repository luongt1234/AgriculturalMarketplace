using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DonHangController : BaseController
    {
        private readonly IDonHangService _donHangService;

        public DonHangController(IDonHangService donHangService)
        {
            _donHangService = donHangService;
        }

        /// <summary>
        /// Lấy danh sách đơn hàng của người dùng hiện tại (người mua)
        /// GET /api/DonHang/my-orders?pageNumber=1&pageSize=10&trangThai=ChoXuLy
        /// </summary>
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? trangThai = null)
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
                    return Error("Không xác định được người dùng", 401);

                TrangThaiDonHang? trangThaiEnum = null;
                if (!string.IsNullOrEmpty(trangThai) && Enum.TryParse<TrangThaiDonHang>(trangThai, out var parsed))
                    trangThaiEnum = parsed;

                var result = await _donHangService.GetMyOrdersAsync(userId, pageNumber, pageSize, trangThaiEnum);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy đơn hàng: {ex.Message}");
            }
        }
    }
}
