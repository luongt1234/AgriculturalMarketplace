using AgroMarket.Application.DTOs.SanPhamYeuThichDtos;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SanPhamYeuThichController : BaseController
    {
        private readonly ISanPhamYeuThichService _sanPhamYeuThichService;

        public SanPhamYeuThichController(ISanPhamYeuThichService sanPhamYeuThichService)
        {
            _sanPhamYeuThichService = sanPhamYeuThichService;
        }

        private Guid GetUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out var guid))
                throw new UnauthorizedAccessException("Không xác định được người dùng");
            return guid;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            try
            {
                var list = await _sanPhamYeuThichService.LlayDanhSachYeuThichAsync(GetUserId());
                return Success(list);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        [HttpGet("ids")]
        public async Task<IActionResult> GetFavoriteIds()
        {
            try
            {
                var list = await _sanPhamYeuThichService.LayDanhSachSanPhamIdYeuThichAsync(GetUserId());
                return Success(list);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }

        [HttpPost("toggle/{sanPhamDangId:guid}")]
        public async Task<IActionResult> ToggleFavorite(Guid sanPhamDangId)
        {
            try
            {
                var isFavorited = await _sanPhamYeuThichService.ToggleYeuThichAsync(GetUserId(), sanPhamDangId);
                var message = isFavorited ? "Đã thêm vào danh sách yêu thích" : "Đã xoá khỏi danh sách yêu thích";
                return Success(new { isFavorited }, message);
            }
            catch (Exception ex)
            {
                return Error(ex.Message);
            }
        }
    }
}
