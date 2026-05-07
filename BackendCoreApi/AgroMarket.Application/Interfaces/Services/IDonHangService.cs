using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Wrappers;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IDonHangService
    {
        // ── Buyer ────────────────────────────────────────────────────────────────
        Task<PagedResponse<IEnumerable<DonHangDto>>> GetMyOrdersAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null);

        Task<TaoDonHangResponse> TaoDonHangAsync(Guid nguoiMuaId, TaoDonHangRequest request);

        // ── Seller ───────────────────────────────────────────────────────────────
        Task<PagedResponse<IEnumerable<DonHangDto>>> GetSellerOrdersAsync(
            Guid nguoiBanId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null);

        Task<bool> SellerXacNhanAsync(Guid donHangId, Guid nguoiBanId);
        Task<bool> SellerTuChoiAsync(Guid donHangId, Guid nguoiBanId);
        Task<bool> SellerGiaoHangAsync(Guid donHangId, Guid nguoiBanId);

        // ── Buyer (post-delivery) ────────────────────────────────────────────────
        Task<bool> BuyerXacNhanDaNhanAsync(Guid donHangId, Guid nguoiMuaId);

        /// <summary>Buyer hủy đơn (chỉ khi ChoXuLy). MoMo sẽ hoàn tiền tự động.</summary>
        Task<bool> BuyerHuyDonHangAsync(Guid donHangId, Guid nguoiMuaId);
    }
}
