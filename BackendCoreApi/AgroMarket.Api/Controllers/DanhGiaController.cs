using AgroMarket.Application.DTOs.DanhGiaDtos;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhGiaController : BaseController
    {
        private readonly IDanhGiaService _danhGiaService;

        public DanhGiaController(IDanhGiaService danhGiaService)
        {
            _danhGiaService = danhGiaService;
        }

        /// <summary>
        /// Lấy đánh giá của một sản phẩm (public – không cần đăng nhập).
        /// GET /api/DanhGia/san-pham/{sanPhamDangId}?page=1&pageSize=10&filterSao=5
        /// </summary>
        [HttpGet("san-pham/{sanPhamDangId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviews(
            Guid sanPhamDangId,
            [FromQuery] int page     = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? filterSao = null)
        {
            try
            {
                var result = await _danhGiaService.GetReviewsBySanPhamAsync(
                    sanPhamDangId, page, pageSize, filterSao);
                return Success(result);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy đánh giá: {ex.Message}");
            }
        }

        /// <summary>
        /// Kiểm tra buyer có thể đánh giá không.
        /// GET /api/DanhGia/co-the-danh-gia?donHangId=...&sanPhamDangId=...
        /// </summary>
        [HttpGet("co-the-danh-gia")]
        [Authorize]
        public async Task<IActionResult> KiemTraCoTheDanhGia(
            [FromQuery] Guid donHangId,
            [FromQuery] Guid sanPhamDangId)
        {
            try
            {
                var buyerId = GetCurrentUserId();
                if (buyerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var result = await _danhGiaService.KiemTraCoTheDanhGiaAsync(buyerId, donHangId, sanPhamDangId);
                return Success(result);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// Buyer gửi đánh giá (phải đăng nhập).
        /// POST /api/DanhGia
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> TaoDanhGia([FromBody] TaoDanhGiaRequest request)
        {
            try
            {
                var buyerId = GetCurrentUserId();
                if (buyerId == Guid.Empty) return Error("Không xác định được người dùng", 401);

                var result = await _danhGiaService.TaoDanhGiaAsync(buyerId, request);
                return Success(result);
            }
            catch (InvalidOperationException ex)
            {
                return Error(ex.Message, 400);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi gửi đánh giá: {ex.Message}");
            }
        }

        // ── Helper ──────────────────────────────────────────────────────────────
        private Guid GetCurrentUserId()
        {
            var str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(str, out var id) ? id : Guid.Empty;
        }
    }
}
