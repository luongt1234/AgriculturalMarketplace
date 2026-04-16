using AgroMarket.Application.DTOs.CuaHangDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ICuaHangService
    {
        /// <summary>Lấy thông tin profile người bán + thống kê</summary>
        Task<SellerProfileDto?> GetSellerProfileAsync(Guid sellerId, Guid? currentUserId = null);

        /// <summary>Lấy danh sách sản phẩm của người bán (paged, search, filter)</summary>
        Task<(List<SanPhamCuaHangDto> Items, int Total)> GetSellerProductsAsync(
            Guid sellerId,
            int page,
            int pageSize,
            string? search = null,
            string? tenSanPhamChung = null);

        /// <summary>Lấy thông tin cấu hình shop</summary>
        Task<StoreSettingsDto?> GetMyShopAsync(Guid sellerId);

        /// <summary>Cập nhật thông tin cấu hình shop</summary>
        Task UpdateMyShopAsync(Guid sellerId, StoreSettingsDto dto);

        /// <summary>Theo dõi người bán (CREATE)</summary>
        Task TheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId);

        /// <summary>Huỷ theo dõi (DELETE)</summary>
        Task HuyTheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId);

        /// <summary>Kiểm tra đã theo dõi chưa (READ)</summary>
        Task<bool> IsTheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId);
    }
}
