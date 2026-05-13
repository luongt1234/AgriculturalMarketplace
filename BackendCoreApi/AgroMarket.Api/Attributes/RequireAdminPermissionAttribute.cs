using AgroMarket.Domain.Enums;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AgroMarket.Api.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class RequireAdminPermissionAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string _permissionCode;

        public RequireAdminPermissionAttribute(string permissionCode)
        {
            _permissionCode = permissionCode;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (user?.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new JsonResult(new { message = "Unauthorized. Vui lòng đăng nhập để tiếp tục." })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
                return;
            }

            if (user.FindFirst(ClaimTypes.Role)?.Value != UserRole.Admin)
            {
                context.Result = new JsonResult(new { message = "Forbidden. Chỉ quản trị viên được sử dụng chức năng này." })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }

            var userIdValue = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdValue, out var userId))
            {
                context.Result = new JsonResult(new { message = "Forbidden. Không xác định được tài khoản quản trị." })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }

            var dbContext = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

            var configured = dbContext.AdminChucNangPhanQuyens
                .IgnoreQueryFilters()
                .Any(pq => pq.NguoiDungId == userId && !pq.IsDeleted);

            if (!configured)
            {
                return;
            }

            var allowed = dbContext.AdminChucNangPhanQuyens
                .Any(pq => pq.NguoiDungId == userId && pq.MaChucNang == _permissionCode);

            if (!allowed)
            {
                context.Result = new JsonResult(new { message = "Forbidden. Bạn không có quyền sử dụng chức năng này." })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }
    }
}
