using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Application.Wrappers;
using Microsoft.AspNetCore.Http;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ISanPhamDangService
    {
        Task<SanPhamDangDto> CreateAsync(SanPhamDangFormDto request, IFormFile? hinhAnh);
        Task<PagedResponse<IEnumerable<SanPhamDangDto>>> GetAllProductsAsync(int pageNumber = 1, int pageSize = 10);
        Task<PagedResponse<IEnumerable<SanPhamDangDto>>> GetProductsByUserAsync(Guid userId, int pageNumber = 1, int pageSize = 10);
        Task<SanPhamDangDto?> GetByIdAsync(Guid id);
    }
}
