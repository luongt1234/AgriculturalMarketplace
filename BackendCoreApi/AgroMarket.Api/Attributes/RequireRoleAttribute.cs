using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace AgroMarket.Api.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class RequireRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _allowedRoles;

        public RequireRoleAttribute(params string[] roles)
        {
            _allowedRoles = roles;
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

            if (_allowedRoles == null || _allowedRoles.Length == 0)
            {
                return;
            }

            var roleClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(roleClaim))
            {
                context.Result = new JsonResult(new { message = "Forbidden. Thông tin quyền không tồn tại trong Token." })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }

            if (!_allowedRoles.Contains(roleClaim))
            {
                context.Result = new JsonResult(new { message = "Forbidden. Bạn không có quyền thực hiện thao tác này." })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }
    }
}