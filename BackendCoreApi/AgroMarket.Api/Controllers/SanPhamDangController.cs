using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SanPhamDangController : BaseCrudController<SanPhamDang, SanPhamDangDto, SanPhamDangFormDto>
    {
        private readonly ISanPhamDangService _sanPhamDangService;
        public SanPhamDangController(IBaseService<SanPhamDang> service, IMapper mapper, ISanPhamDangService sanPhamDangService) : base(service, mapper)
        {
            _sanPhamDangService = sanPhamDangService;
        }

        [HttpPost]
        public override async Task<IActionResult> Create([FromForm] SanPhamDangFormDto formDto)
        {
            try
            {
                var result = await _sanPhamDangService.CreateAsync(formDto, formDto.HinhAnh);
                return CreatedResult(result, "Thêm mới thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi tạo sản phẩm đăng: {ex.Message}");
            }
        }

        [HttpGet("product")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProduct([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _sanPhamDangService.GetAllProductsAsync(pageNumber, pageSize);
                return PagedResult(result.Data, result.PageNumber, result.PageSize, result.TotalRecords);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách sản phẩm: {ex.Message}");
            }
        }

        [HttpGet("display")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductForDisplay([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? keyword = null, [FromQuery] Guid? sanPhamChungId = null)
        {
            try
            {
                var result = await _sanPhamDangService.GetAllProductsForDisplayAsync(pageNumber, pageSize, keyword, sanPhamChungId);
                return PagedResult(result.Data, result.PageNumber, result.PageSize, result.TotalRecords);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách sản phẩm cho hiển thị: {ex.Message}");
            }
        }

        [HttpGet("search-suggestions")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSearchSuggestions([FromQuery] string keyword, [FromQuery] int limit = 5)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(keyword)) return Success(new List<SanPhamDangDto>());
                var items = await _sanPhamDangService.GetSearchSuggestionsAsync(keyword, limit);
                return Success(items);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách gợi ý: {ex.Message}");
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetListProductByUser([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                // Lấy user id từ claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Forbid();

                var result = await _sanPhamDangService.GetProductsByUserAsync(userId, pageNumber, pageSize);
                return PagedResult(result.Data, result.PageNumber, result.PageSize, result.TotalRecords);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách sản phẩm người dùng: {ex.Message}");
            }
        }

        [HttpGet("detail/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDetailById([FromRoute] Guid id)
        {
            try
            {
                var dto = await _sanPhamDangService.GetDetailByIdAsync(id);
                if (dto == null)
                    return Error("Không tìm thấy sản phẩm", 404);

                return Success(dto);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy chi tiết sản phẩm: {ex.Message}");
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromForm] SanPhamDangFormDto formDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Forbid();

                var result = await _sanPhamDangService.UpdateAsync(id, formDto, formDto.HinhAnh, userId);
                return Success(result, "Cập nhật sản phẩm thành công");
            }
            catch (KeyNotFoundException ex)
            {
                return Error(ex.Message, 404);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Error(ex.Message, 403);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi cập nhật sản phẩm: {ex.Message}");
            }
        }

        [HttpPut("{id}/toggle-ghim")]
        public async Task<IActionResult> ToggleGhim([FromRoute] Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Forbid();

                var newStatus = await _sanPhamDangService.ToggleGhimAsync(id, userId);
                return Success(new { isGhim = newStatus }, "Cập nhật trạng thái ghim thành công");
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi ghim sản phẩm: {ex.Message}");
            }
        }
    }
}
