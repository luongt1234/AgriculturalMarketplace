using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
                var result = await _sanPhamDangService.CreateAsync(formDto, formDto.hinh_anh);
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
    }
}
