using AgroMarket.Application.DTOs.SanPhamChuDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ISanPhamChungService
    {
        Task<IEnumerable<SanPhamChungDto>> GetAllWithDetailsAsync(int pageSize = 10, int pageNumber = 1);
        Task<IEnumerable<SanPhamChungDto>> GetTree();
    }
}
