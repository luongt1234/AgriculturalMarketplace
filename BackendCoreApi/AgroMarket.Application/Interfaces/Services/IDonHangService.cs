using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Wrappers;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IDonHangService
    {
        Task<PagedResponse<IEnumerable<DonHangDto>>> GetMyOrdersAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null);
    }
}
