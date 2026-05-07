using AgroMarket.Api.Attributes;
using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;
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

        [RequireRole(UserRole.Admin)]
        public override async Task<IActionResult> Create([FromBody] NguoiDungFormDto payload)
        {
            try
            {
                await _nguoiDungService.CreateUserAsync(payload);
                return CreatedResult("Thêm mới thành công");
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi thêm mới người dùng: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetByMa/{ma}")]
        [RequireRole(UserRole.Admin)]
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
                return PagedResult(result.Data, result.PageNumber, result.PageSize, result.TotalRecords);
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi lấy danh sách người dùng: {ex.Message}");
            }
        }

        [HttpPut("register-seller")]
        [Authorize]
        public async Task<IActionResult> RegisterSeller()
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdStr, out var userId))
                {
                    return Unauthorized("Không xác định được người dùng.");
                }

                await _nguoiDungService.RegisterSellerAsync(userId);
                
                // Trả về token mới nếu cần, nhưng ở đây có thể bắt frontend logout/login lại 
                // hoặc refresh token. Tạm thời trả về message thành công.
                return Ok(new { message = "Đã đăng ký làm người bán thành công. Vui lòng đăng xuất và đăng nhập lại để cập nhật quyền." });
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi đăng ký làm người bán: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy số dư ví hiện tại của người dùng đang đăng nhập.
        /// GET /api/NguoiDung/me/so-du
        /// </summary>
        [HttpGet("me/so-du")]
        public async Task<IActionResult> GetSoDu()
        {
            try
            {
                var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdStr, out var userId))
                    return Unauthorized("Không xác định được người dùng.");

                var soDu = await _nguoiDungService.GetSoDuAsync(userId);
                return Ok(new { soDu });
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi lấy số dư: {ex.Message}");
            }
        }
    }
}
