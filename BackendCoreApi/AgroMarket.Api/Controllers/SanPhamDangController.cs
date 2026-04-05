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

        //[HttpGet]
        //[Route("get-product-by-buyer/{id}")]
        //public async Task<IActionResult> GetProductByBuyer([FromRoute] Guid id)
        //{
        //    try
        //    {
        //        var result = await _sanPhamDangService.GetProductByBuyerAsync(id);
        //        return CreatedResult(result, "Thêm mới thành công");
        //    }
        //    catch (Exception ex)
        //    {
        //        return Error($"Lỗi khi tạo sản phẩm đăng: {ex.Message}");
        //    }
        //}

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
        public async Task<IActionResult> GetProductForDisplay([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _sanPhamDangService.GetAllProductsForDisplayAsync(pageNumber, pageSize);
                return PagedResult(result.Data, result.PageNumber, result.PageSize, result.TotalRecords);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách sản phẩm cho hiển thị: {ex.Message}");
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
    }
}
