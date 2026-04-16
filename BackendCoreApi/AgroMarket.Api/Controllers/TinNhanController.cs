using AgroMarket.Application.DTOs.TinNhanDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Wrappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TinNhanController : BaseController
    {
        private readonly ITinNhanService _tinNhanService;

        public TinNhanController(ITinNhanService tinNhanService)
        {
            _tinNhanService = tinNhanService;
        }

        private Guid GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }

        /// <summary>
        /// GET /api/TinNhan/conversations
        /// Lấy danh sách cuộc hội thoại của user hiện tại
        /// </summary>
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var result = await _tinNhanService.GetCuocTroChuyenAsync(userId);
                return Success(result, "Lấy danh sách hội thoại thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// GET /api/TinNhan/history/{otherUserId}?page=1&pageSize=30
        /// Lấy lịch sử tin nhắn giữa user hiện tại và otherUserId
        /// </summary>
        [HttpGet("history/{otherUserId}")]
        public async Task<IActionResult> GetHistory(
            [FromRoute] Guid otherUserId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 30)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var result = await _tinNhanService.GetLichSuTinNhanAsync(userId, otherUserId, page, pageSize);
                return Success(result, "Lấy lịch sử tin nhắn thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// POST /api/TinNhan/send
        /// Gửi tin nhắn qua REST (fallback khi SignalR không khả dụng)
        /// </summary>
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] GuiTinNhanDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Error("Không xác định được người dùng", 401);
                if (string.IsNullOrWhiteSpace(request.NoiDung)) return Error("Nội dung không được để trống", 400);

                var result = await _tinNhanService.GuiTinNhanAsync(request, userId);
                return CreatedResult(result, "Gửi tin nhắn thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// PATCH /api/TinNhan/mark-read/{otherUserId}
        /// Đánh dấu tất cả tin từ otherUserId là đã đọc
        /// </summary>
        [HttpPatch("mark-read/{otherUserId}")]
        public async Task<IActionResult> MarkRead([FromRoute] Guid otherUserId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                await _tinNhanService.DanhDauDaDocAsync(userId, otherUserId);
                return Success("Đã đánh dấu đọc thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// GET /api/TinNhan/unread-count
        /// Đếm tổng tin chưa đọc của user hiện tại
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var count = await _tinNhanService.DemTinChuaDocAsync(userId);
                return Success(count, "Lấy số tin chưa đọc thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi: {ex.Message}");
            }
        }
    }
}
