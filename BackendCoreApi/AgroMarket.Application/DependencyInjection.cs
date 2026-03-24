using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.Common.Services;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AgroMarket.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(DependencyInjection).Assembly);
            services.AddHttpContextAccessor();
            // Đăng ký Base Service Generic
            services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

            // service triển khai 
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDanhMucService, DanhMucService>();
            services.AddScoped<ISanPhamChungService, SanPhamChungService>();
            services.AddScoped<ISanPhamDangService, SanPhamDangService>();
            services.AddScoped<INguoiDungService, NguoiDungService>();

            return services;
        }
    }
}