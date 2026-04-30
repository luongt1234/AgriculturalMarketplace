using AgroMarket.Api.Hubs;
using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DonHangController : BaseController
    {
        private readonly IDonHangService _donHangService;
        private readonly IHubContext<OrderHub> _orderHub;

        public DonHangController(IDonHangService donHangService, IHubContext<OrderHub> orderHub)
        {
            _donHangService = donHangService;
            _orderHub      = orderHub;
        }

        // ════════════════════════════════════════════════════════════════════════
        // BUYER ENDPOINTS
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Lấy danh sách đơn hàng của người mua hiện tại.
        /// GET /api/DonHang/my-orders?pageNumber=1&pageSize=10&trangThai=ChoXuLy
        /// </summary>
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize   = 10,
            [FromQuery] string? trangThai = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                TrangThaiDonHang? statusFilter = null;
                if (!string.IsNullOrEmpty(trangThai) && Enum.TryParse<TrangThaiDonHang>(trangThai, out var parsed))
                    statusFilter = parsed;

                var result = await _donHangService.GetMyOrdersAsync(userId, pageNumber, pageSize, statusFilter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy đơn hàng: {ex.Message}");
            }
        }

        /// <summary>
        /// Buyer đặt đơn hàng COD (hoặc bất kỳ phương thức nào).
        /// POST /api/DonHang
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> TaoDonHang([FromBody] TaoDonHangRequest request)
        {
            try
            {
                var buyerId = GetCurrentUserId();
                if (buyerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var result = await _donHangService.TaoDonHangAsync(buyerId, request);

                // Push real-time đến seller: "Bạn có đơn hàng mới!"
                await _orderHub.Clients
                    .Group(OrderHub.UserGroup(request.NguoiBanId))
                    .SendAsync("NewOrder", new
                    {
                        donHangId    = result.DonHangId,
                        tongThanhToan = result.TongThanhToan,
                        ngayTao      = result.NgayTao,
                        trangThai    = result.TrangThai
                    });

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Error(ex.Message, 400);
            }
            catch (Exception ex)
            {
                return Error($"Đặt hàng thất bại: {ex.Message}");
            }
        }

        /// <summary>
        /// Buyer xác nhận đã nhận hàng → chuyển sang HoanTat.
        /// PUT /api/DonHang/{id}/confirm-received
        /// </summary>
        [HttpPut("{id:guid}/confirm-received")]
        public async Task<IActionResult> BuyerXacNhanDaNhan(Guid id)
        {
            try
            {
                var buyerId = GetCurrentUserId();
                if (buyerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var ok = await _donHangService.BuyerXacNhanDaNhanAsync(id, buyerId);
                if (!ok) return Error("Không thể cập nhật trạng thái đơn hàng.", 400);

                return Ok(new { message = "Đã xác nhận nhận hàng thành công." });
            }
            catch (Exception ex)
            {
                return Error(ex.Message, 400);
            }
        }

        /// <summary>
        /// Seller lấy danh sách đơn hàng của shop mình.
        /// GET /api/DonHang/seller-orders?pageNumber=1&pageSize=10&trangThai=ChoXuLy
        /// </summary>
        [HttpGet("seller-orders")]
        public async Task<IActionResult> GetSellerOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize   = 10,
            [FromQuery] string? trangThai = null)
        {
            try
            {
                var sellerId = GetCurrentUserId();
                if (sellerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                TrangThaiDonHang? statusFilter = null;
                if (!string.IsNullOrEmpty(trangThai) && Enum.TryParse<TrangThaiDonHang>(trangThai, out var parsed))
                    statusFilter = parsed;

                var result = await _donHangService.GetSellerOrdersAsync(sellerId, pageNumber, pageSize, statusFilter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy đơn hàng: {ex.Message}");
            }
        }

        /// <summary>
        /// Seller xác nhận đơn → chuyển sang XacNhan.
        /// PUT /api/DonHang/{id}/accept
        /// </summary>
        [HttpPut("{id:guid}/accept")]
        public async Task<IActionResult> SellerXacNhan(Guid id)
        {
            try
            {
                var sellerId = GetCurrentUserId();
                if (sellerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var ok = await _donHangService.SellerXacNhanAsync(id, sellerId);
                if (!ok) return Error("Không thể xác nhận đơn hàng.", 400);

                // Notify buyer
                await NotifyBuyerStatusChanged(id, "XacNhan", "Đơn hàng của bạn đã được xác nhận.");

                return Ok(new { message = "Đã xác nhận đơn hàng." });
            }
            catch (Exception ex)
            {
                return Error(ex.Message, 400);
            }
        }

        /// <summary>
        /// Seller từ chối đơn → chuyển sang Huy.
        /// PUT /api/DonHang/{id}/reject
        /// </summary>
        [HttpPut("{id:guid}/reject")]
        public async Task<IActionResult> SellerTuChoi(Guid id)
        {
            try
            {
                var sellerId = GetCurrentUserId();
                if (sellerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var ok = await _donHangService.SellerTuChoiAsync(id, sellerId);
                if (!ok) return Error("Không thể từ chối đơn hàng.", 400);

                // Notify buyer
                await NotifyBuyerStatusChanged(id, "Huy", "Đơn hàng của bạn đã bị từ chối.");

                return Ok(new { message = "Đã từ chối đơn hàng." });
            }
            catch (Exception ex)
            {
                return Error(ex.Message, 400);
            }
        }

        /// <summary>
        /// Seller đã đóng gói, chuyển sang giao hàng (DangGiao).
        /// PUT /api/DonHang/{id}/ship
        /// </summary>
        [HttpPut("{id:guid}/ship")]
        public async Task<IActionResult> SellerGiaoHang(Guid id)
        {
            try
            {
                var sellerId = GetCurrentUserId();
                if (sellerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var ok = await _donHangService.SellerGiaoHangAsync(id, sellerId);
                if (!ok) return Error("Không thể cập nhật trạng thái giao hàng.", 400);

                // Notify buyer
                await NotifyBuyerStatusChanged(id, "DangGiao", "Đơn hàng của bạn đang được giao.");

                return Ok(new { message = "Đơn hàng đang được giao." });
            }
            catch (Exception ex)
            {
                return Error(ex.Message, 400);
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        // HELPERS
        // ════════════════════════════════════════════════════════════════════════

        private Guid GetCurrentUserId()
        {
            var str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(str, out var id) ? id : Guid.Empty;
        }

        /// <summary>
        /// Gửi thông báo trạng thái đơn hàng lên group cá nhân của buyer.
        /// Cần biết NguoiMuaId từ đơn hàng – hiện dùng best-effort (không fail request nếu hub lỗi).
        /// </summary>
        private async Task NotifyBuyerStatusChanged(Guid donHangId, string trangThai, string message)
        {
            try
            {
                // TODO: inject IDonHangRepository nếu muốn lấy buyerId chính xác
                // Hiện broadcast theo donHangId cho client tự filter
                await _orderHub.Clients
                    .All  // đổi sang Group khi có buyerId
                    .SendAsync("OrderStatusChanged", new
                    {
                        donHangId,
                        trangThai,
                        message
                    });
            }
            catch { /* best-effort */ }
        }
    }
}
