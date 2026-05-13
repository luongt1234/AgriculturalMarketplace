using AgroMarket.Api.Attributes;
using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;
using AgroMarket.Infrastructure.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NguoiDungController : BaseCrudController<NguoiDung, NguoiDungDto, NguoiDungFormDto>
    {
        private readonly INguoiDungService _nguoiDungService;
        private readonly AppDbContext _context;

        public NguoiDungController(
            INguoiDungService nguoiDungService,
            IBaseService<NguoiDung> service,
            IMapper mapper,
            AppDbContext context) : base(service, mapper)
        {
            _nguoiDungService = nguoiDungService;
            _context = context;
        }

        private static string GetPermissionByRoleCode(string? roleCode)
        {
            return roleCode switch
            {
                "THUONG-LAI" => AdminFeaturePermission.BuyerManagement,
                "NONG-DAN" => AdminFeaturePermission.SellerManagement,
                "ADMIN" => AdminFeaturePermission.AdminAccountManagement,
                _ => AdminFeaturePermission.AdminAccountManagement
            };
        }

        private async Task<bool> HasAdminPermissionAsync(string permissionCode)
        {
            if (User.FindFirst(ClaimTypes.Role)?.Value != UserRole.Admin)
                return false;

            if (!Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var currentUserId))
                return false;

            var configured = await _context.AdminChucNangPhanQuyens
                .IgnoreQueryFilters()
                .AnyAsync(x => x.NguoiDungId == currentUserId && !x.IsDeleted);

            if (!configured)
                return true;

            return await _context.AdminChucNangPhanQuyens
                .AnyAsync(x => x.NguoiDungId == currentUserId && x.MaChucNang == permissionCode);
        }

        private IActionResult ForbiddenFeature()
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Forbidden. Bạn không có quyền sử dụng chức năng này." });
        }

        [RequireRole(UserRole.Admin)]
        public override async Task<IActionResult> Create([FromBody] NguoiDungFormDto payload)
        {
            try
            {
                var role = await _context.DanhMucs.FirstOrDefaultAsync(x => x.Id == payload.VaiTroId);
                if (!await HasAdminPermissionAsync(GetPermissionByRoleCode(role?.MaGiaTri)))
                    return ForbiddenFeature();

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
                    return BadRequest("Mã vai trò không được để trống");

                if (!await HasAdminPermissionAsync(GetPermissionByRoleCode(ma)))
                    return ForbiddenFeature();

                var result = await _nguoiDungService.GetAllByMaAsync(pageSize, pageNumber, ma);
                return PagedResult(result.Data, result.PageNumber, result.PageSize, result.TotalRecords);
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi lấy danh sách người dùng: {ex.Message}");
            }
        }

        [RequireRole(UserRole.Admin)]
        public override async Task<IActionResult> Update(Guid id, [FromBody] NguoiDungFormDto formDto)
        {
            var existingUser = await _context.NguoiDungs
                .Include(x => x.VaiTro)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existingUser == null)
                return Error("Không tìm thấy", 404);

            if (!await HasAdminPermissionAsync(GetPermissionByRoleCode(existingUser.VaiTro.MaGiaTri)))
                return ForbiddenFeature();

            return await base.Update(id, formDto);
        }

        [RequireRole(UserRole.Admin)]
        public override async Task<IActionResult> Delete(Guid id)
        {
            var existingUser = await _context.NguoiDungs
                .Include(x => x.VaiTro)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existingUser == null)
                return Error("Không tìm thấy", 404);

            if (!await HasAdminPermissionAsync(GetPermissionByRoleCode(existingUser.VaiTro.MaGiaTri)))
                return ForbiddenFeature();

            return await base.Delete(id);
        }

        [HttpPut("register-seller")]
        [Authorize]
        public async Task<IActionResult> RegisterSeller()
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdStr, out var userId))
                    return Unauthorized("Không xác định được người dùng.");

                await _nguoiDungService.RegisterSellerAsync(userId);
                return Ok(new { message = "Đã đăng ký làm người bán thành công. Vui lòng đăng xuất và đăng nhập lại để cập nhật quyền." });
            }
            catch (Exception ex)
            {
                return (ActionResult)Error($"Lỗi khi đăng ký làm người bán: {ex.Message}");
            }
        }

        [HttpGet("me/so-du")]
        public async Task<IActionResult> GetSoDu()
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
