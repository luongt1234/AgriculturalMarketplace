using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.Common.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AgroMarket.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(DependencyInjection).Assembly);

            // Đăng ký Base Service Generic
            services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

            return services;
        }
    }
}