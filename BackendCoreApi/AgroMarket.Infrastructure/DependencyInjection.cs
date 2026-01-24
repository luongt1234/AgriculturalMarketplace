using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Infrastructure.Persistence;
using AgroMarket.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AgroMarket.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Config DB
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseMySql(
                    configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(configuration.GetConnectionString("DefaultConnection"))
                )
                .UseSnakeCaseNamingConvention();
            });

            services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}