using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IDonHangRepository
    {
        Task<(IEnumerable<DonHangDto> Items, int TotalRecords)> GetByNguoiMuaPagedAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null);
    }
}
