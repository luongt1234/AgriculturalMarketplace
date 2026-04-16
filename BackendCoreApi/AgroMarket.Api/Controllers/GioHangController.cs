using AgroMarket.Application.DTOs.GioHangDtos;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GioHangController : BaseController
    {
        private readonly IGioHangService _gioHangService;

        public GioHangController(IGioHangService gioHangService)
        {
            _gioHangService = gioHangService;
        }

        private Guid GetUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out var guid))
                throw new UnauthorizedAccessException("Không xác định được người dùng");
            return guid;
        }

        /// <summary>Lấy giỏ hàng hiện tại. GET /api/GioHang</summary>
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var cart = await _gioHangService.GetCartAsync(GetUserId());
                return Success(cart);
            }
            catch (Exception ex) { return Error(ex.Message); }
        }

        /// <summary>Thêm/cộng dồn sản phẩm. POST /api/GioHang/them</summary>
        [HttpPost("them")]
        public async Task<IActionResult> AddItem([FromBody] ThemVaoGioHangDto dto)
        {
            try
            {
                var cart = await _gioHangService.AddOrUpdateItemAsync(GetUserId(), dto);
                return Success(cart, "Đã thêm vào giỏ hàng");
            }
            catch (Exception ex) { return Error(ex.Message); }
        }

        /// <summary>Cập nhật số lượng. PUT /api/GioHang/{chiTietId}/so-luong</summary>
        [HttpPut("{chiTietId:guid}/so-luong")]
        public async Task<IActionResult> UpdateQuantity(Guid chiTietId, [FromBody] CapNhatSoLuongDto dto)
        {
            try
            {
                var cart = await _gioHangService.UpdateItemQuantityAsync(GetUserId(), chiTietId, dto.SoLuong);
                return Success(cart);
            }
            catch (KeyNotFoundException ex) { return Error(ex.Message, 404); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        /// <summary>Xoá 1 sản phẩm. DELETE /api/GioHang/{chiTietId}</summary>
        [HttpDelete("{chiTietId:guid}")]
        public async Task<IActionResult> RemoveItem(Guid chiTietId)
        {
            try
            {
                var cart = await _gioHangService.RemoveItemAsync(GetUserId(), chiTietId);
                return Success(cart, "Đã xoá sản phẩm khỏi giỏ hàng");
            }
            catch (KeyNotFoundException ex) { return Error(ex.Message, 404); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        /// <summary>Xoá hết giỏ hàng. DELETE /api/GioHang/clear</summary>
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                await _gioHangService.ClearCartAsync(GetUserId());
                return Success("Đã xoá giỏ hàng");
            }
            catch (Exception ex) { return Error(ex.Message); }
        }
    }
}
