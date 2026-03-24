using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.DanhMucDtos;
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
    public class DanhMucController : BaseCrudController<DanhMuc, DanhMucDto, DanhMucFormDto>
    {
        private readonly IDanhMucService _danhMucService;
        public DanhMucController(IBaseService<DanhMuc> service, IMapper mapper, IDanhMucService danhMucService) : base(service, mapper)
        {
            _danhMucService = danhMucService;
        }

        [HttpGet("{loai}")]
        public async Task<IActionResult> GetCatagoryByType([FromRoute] string? loai)
        {
            var result = await _danhMucService.GetDanhMucByLoai(loai);
            return Success(result, "Lấy danh sách loại");
        }

        [HttpGet("GetByMaGiaTri/{MaGiaTri}")]
        public async Task<IActionResult> GetCatagoryByCodeValue([FromRoute] string? MaGiaTri)
        {
            try
            {
                if (string.IsNullOrEmpty(MaGiaTri))
                {
                    return BadRequest("ma không được để trống");
                }
                var result = await _danhMucService.GetDanhMucByMaGiaTriAsync(MaGiaTri);
                return Success(result, "Lấy dữ liệu danh mục thành công");
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi lấy danh mục vai trò: {ex.Message}");
            }
        }
    }
}
