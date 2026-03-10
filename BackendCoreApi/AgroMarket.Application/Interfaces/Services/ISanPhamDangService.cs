using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Application.Wrappers;
using Microsoft.AspNetCore.Http;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ISanPhamDangService
    {
        Task<SanPhamDangDto> CreateAsync(SanPhamDangFormDto request, IFormFile? hinhAnh);
        Task<PaginatedResult<IEnumerable<SanPhamDangDto>>> GetProductByBuyerAsync(Guid buyerId);
    }
}
