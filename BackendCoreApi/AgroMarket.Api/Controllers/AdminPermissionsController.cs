using AgroMarket.Api.Attributes;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRole.Admin)]
    public class AdminPermissionsController : BaseController
    {
        private readonly AppDbContext _context;

        public AdminPermissionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("features")]
        public IActionResult GetFeatures()
        {
            var features = AdminFeaturePermission.Labels
                .Select(x => new AdminFeatureDto(x.Key, x.Value))
                .ToList();

            return Success(features);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyPermissions()
        {
            if (!Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
                return Error("Không xác định được tài khoản quản trị.", 401);

            var configured = await _context.AdminChucNangPhanQuyens
                .IgnoreQueryFilters()
                .AnyAsync(x => x.NguoiDungId == userId && !x.IsDeleted);

            if (!configured)
                return Success(AdminFeaturePermission.All);

            var permissions = await _context.AdminChucNangPhanQuyens
                .Where(x => x.NguoiDungId == userId)
                .Where(x => AdminFeaturePermission.All.Contains(x.MaChucNang))
                .Select(x => x.MaChucNang)
                .ToListAsync();

            return Success(permissions);
        }

        [HttpGet("user/{userId:guid}")]
        [RequireAdminPermission(AdminFeaturePermission.PermissionManagement)]
        public async Task<IActionResult> GetUserPermissions(Guid userId)
        {
            var permissions = await _context.AdminChucNangPhanQuyens
                .Where(x => x.NguoiDungId == userId)
                .Where(x => AdminFeaturePermission.All.Contains(x.MaChucNang))
                .Select(x => x.MaChucNang)
                .ToListAsync();

            return Success(permissions);
        }

        [HttpPut("user/{userId:guid}")]
        [RequireAdminPermission(AdminFeaturePermission.PermissionManagement)]
        public async Task<IActionResult> UpdateUserPermissions(Guid userId, [FromBody] UpdateAdminPermissionsRequest request)
        {
            var admin = await _context.NguoiDungs
                .Include(x => x.VaiTro)
                .FirstOrDefaultAsync(x => x.Id == userId && x.VaiTro.MaGiaTri == UserRole.Admin);

            if (admin == null)
                return Error("Không tìm thấy tài khoản quản trị.", 404);

            var requestedPermissions = request.PermissionCodes
                .Where(AdminFeaturePermission.All.Contains)
                .Distinct()
                .ToList();
            var storedPermissionCodes = requestedPermissions
                .Append(AdminFeaturePermission.ConfiguredMarker)
                .ToList();

            var currentPermissions = await _context.AdminChucNangPhanQuyens
                .IgnoreQueryFilters()
                .Where(x => x.NguoiDungId == userId)
                .ToListAsync();

            foreach (var current in currentPermissions)
            {
                if (!storedPermissionCodes.Contains(current.MaChucNang))
                {
                    current.IsDeleted = true;
                    current.NgayChinhSua = DateTime.UtcNow;
                }
            }

            foreach (var permissionCode in storedPermissionCodes)
            {
                var existing = currentPermissions.FirstOrDefault(x => x.MaChucNang == permissionCode);
                if (existing == null)
                {
                    _context.AdminChucNangPhanQuyens.Add(new AdminChucNangPhanQuyen
                    {
                        Id = Guid.NewGuid(),
                        NguoiDungId = userId,
                        MaChucNang = permissionCode
                    });
                    continue;
                }

                existing.IsDeleted = false;
                existing.NgayChinhSua = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Success("Cập nhật phân quyền thành công");
        }
    }

    public record AdminFeatureDto(string Code, string Label);

    public class UpdateAdminPermissionsRequest
    {
        public List<string> PermissionCodes { get; set; } = new();
    }
}
