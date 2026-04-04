using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class SanPhamChungController : BaseCrudController<SanPhamChung, SanPhamChungDto, SanPhamChungFormDto>
    {
        private readonly ISanPhamChungService _sanPhamChungService;
        public SanPhamChungController(IBaseService<SanPhamChung> service, IMapper mapper, ISanPhamChungService sanPhamChungService) : base(service, mapper)
        {
            _sanPhamChungService = sanPhamChungService;
        }

        public override async Task<IActionResult> GetAll()
        {
            try
            {
                var entities = await _sanPhamChungService.GetAllWithDetailsAsync();
                //var dtos = _mapper.Map<IEnumerable<SanPhamChungDto>>(entities);
                return Success(entities);

            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách sản phẩm chung: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("get-tree")]
        public async Task<IActionResult> GetTreeByMaLoai()
        {
            try
            {
                var result = await _sanPhamChungService.GetTree();
                //var dtos = _mapper.Map<IEnumerable<SanPhamChungDto>>(entities);
                return Success(result);
            }
            catch (Exception ex)
            {
                return Error($"Lỗi khi lấy danh sách sản phẩm chung: {ex.Message}");
            }
        }
    }
}
