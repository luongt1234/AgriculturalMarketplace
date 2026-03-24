using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NguoiDungController : BaseCrudController<NguoiDung, NguoiDungDto, NguoiDungFormDto>
    {
        private readonly INguoiDungService _nguoiDungService;
        public NguoiDungController(INguoiDungService nguoiDungService, IBaseService<NguoiDung> service, IMapper mapper) : base(service, mapper)
        {
            _nguoiDungService = nguoiDungService;
        }

        [HttpGet]
        [Route("GetByMa/{ma}")]
        public async Task<IActionResult> GetBuyer([FromQuery] int pageSize, [FromQuery] int pageNumber, [FromRoute] string ma)
        {
            try
            {
                if (string.IsNullOrEmpty(ma))
                {
                    return BadRequest("ma không được để trống");
                }
                // xác thực admin
                var result = await _nguoiDungService.GetAllByMaAsync(pageSize, pageNumber, ma);
                return Success(result, "Lấy dữ liệu người bán thành công");
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi lấy danh sách người dùng: {ex.Message}");
            }
        } 
    }
}
