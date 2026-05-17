using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuaHangController : BaseController
    {
        private readonly ICuaHangService _cuaHangService;

        public CuaHangController(ICuaHangService cuaHangService)
        {
            _cuaHangService = cuaHangService;
        }

        private Guid? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : (Guid?)null;
        }

        // ─── READ: Profile ───────────────────────────────────────────────────
        /// <summary>GET /api/CuaHang/{sellerId} — Thông tin tổng quan cửa hàng</summary>
        [HttpGet("{sellerId:guid}")]
        public async Task<IActionResult> GetProfile([FromRoute] Guid sellerId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var profile = await _cuaHangService.GetSellerProfileAsync(sellerId, currentUserId);
                if (profile is null) return Error("Không tìm thấy cửa hàng.", 404);
                return Success(profile, "Lấy thông tin cửa hàng thành công.");
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── READ: Search Sellers ────────────────────────────────────────────
        /// <summary>GET /api/CuaHang/search?keyword=abc&page=1&pageSize=10</summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchSellers(
            [FromQuery] string keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var (items, total) = await _cuaHangService.SearchSellersAsync(keyword, page, pageSize);
                return PagedResult(items, page, pageSize, total);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── READ: Followed Sellers ───────────────────────────────────────────
        /// <summary>GET /api/CuaHang/following?page=1&pageSize=10</summary>
        [HttpGet("following")]
        [Authorize]
        public async Task<IActionResult> GetFollowedSellers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue) return Error("Chưa xác thực.", 401);

                var (items, total) = await _cuaHangService.GetFollowedSellersAsync(userId.Value, page, pageSize);
                return PagedResult(items, page, pageSize, total);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── READ: Products paged ────────────────────────────────────────────
        /// <summary>GET /api/CuaHang/{sellerId}/products?page=1&pageSize=9&search=&category=</summary>
        [HttpGet("{sellerId:guid}/products")]
        public async Task<IActionResult> GetProducts(
            [FromRoute] Guid sellerId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 9,
            [FromQuery] string? search = null,
            [FromQuery] string? category = null)
        {
            try
            {
                var (items, total) = await _cuaHangService.GetSellerProductsAsync(sellerId, page, pageSize, search, category);
                return PagedResult(items, page, pageSize, total);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── SETTINGS: Shop ──────────────────────────────────────────────────
        /// <summary>GET /api/CuaHang/my-shop</summary>
        [HttpGet("my-shop")]
        [Authorize]
        public async Task<IActionResult> GetMyShop()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue) return Error("Chưa xác thực.", 401);

                var shop = await _cuaHangService.GetMyShopAsync(userId.Value);
                if (shop is null) return Error("Không tìm thấy người bán.", 404);
                return Success(shop, "Lấy thông tin shop thành công.");
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        /// <summary>PUT /api/CuaHang/my-shop</summary>
        [HttpPut("my-shop")]
        [Authorize]
        public async Task<IActionResult> UpdateMyShop([FromBody] AgroMarket.Application.DTOs.CuaHangDtos.StoreSettingsDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue) return Error("Chưa xác thực.", 401);

                await _cuaHangService.UpdateMyShopAsync(userId.Value, dto);
                return Success("Cập nhật thông tin shop thành công.");
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── CHECK: isFollowing ───────────────────────────────────────────────
        /// <summary>GET /api/CuaHang/{sellerId}/theo-doi/check</summary>
        [HttpGet("{sellerId:guid}/theo-doi/check")]
        [Authorize]
        public async Task<IActionResult> CheckFollow([FromRoute] Guid sellerId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue) return Error("Chưa xác thực.", 401);

                var isFollowing = await _cuaHangService.IsTheoDoiAsync(userId.Value, sellerId);
                return Success(isFollowing, "Kiểm tra theo dõi thành công.");
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── CREATE: Follow ───────────────────────────────────────────────────
        /// <summary>POST /api/CuaHang/{sellerId}/theo-doi</summary>
        [HttpPost("{sellerId:guid}/theo-doi")]
        [Authorize]
        public async Task<IActionResult> Follow([FromRoute] Guid sellerId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue) return Error("Chưa xác thực.", 401);

                await _cuaHangService.TheoDoiAsync(userId.Value, sellerId);
                return CreatedResult(true, "Đã theo dõi cửa hàng.");
            }
            catch (InvalidOperationException ex)
            {
                return Error(ex.Message, 400);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        // ─── DELETE: Unfollow ─────────────────────────────────────────────────
        /// <summary>DELETE /api/CuaHang/{sellerId}/theo-doi</summary>
        [HttpDelete("{sellerId:guid}/theo-doi")]
        [Authorize]
        public async Task<IActionResult> Unfollow([FromRoute] Guid sellerId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue) return Error("Chưa xác thực.", 401);

                await _cuaHangService.HuyTheoDoiAsync(userId.Value, sellerId);
                return Success("Đã huỷ theo dõi cửa hàng.");
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }
    }
}
