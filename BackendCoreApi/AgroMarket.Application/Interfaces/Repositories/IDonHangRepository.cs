using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IDonHangRepository
    {
        // Buyer: lấy đơn của mình
        Task<(IEnumerable<DonHangDto> Items, int TotalRecords)> GetByNguoiMuaPagedAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null);

        // Tạo đơn hàng mới
        Task<DonHang> TaoDonHangAsync(DonHang donHang, List<ChiTietDonHang> chiTiet);

        // Lấy đơn theo Id (bao gồm chi tiết)
        Task<DonHang?> GetByIdWithDetailsAsync(Guid donHangId);

        // Seller: lấy đơn của shop mình
        Task<(IEnumerable<DonHangDto> Items, int TotalRecords)> GetByNguoiBanPagedAsync(
            Guid nguoiBanId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null);

        // Cập nhật trạng thái
        Task<bool> CapNhatTrangThaiAsync(Guid donHangId, TrangThaiDonHang trangThai, Guid actorId);
    }
}
