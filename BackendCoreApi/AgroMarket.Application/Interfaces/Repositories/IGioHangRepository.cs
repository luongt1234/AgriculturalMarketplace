using AgroMarket.Application.DTOs.GioHangDtos;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IGioHangRepository
    {
        /// <summary>Lấy giỏ hàng (kèm chi tiết) theo NguoiDungId. Tự tạo nếu chưa có.</summary>
        Task<GioHangDto> GetOrCreateCartAsync(Guid nguoiDungId);

        /// <summary>Thêm hoặc cộng dồn số lượng vào giỏ hàng.</summary>
        Task<GioHangDto> AddOrUpdateItemAsync(Guid nguoiDungId, Guid sanPhamDangId, int soLuong);

        /// <summary>Cập nhật số lượng của 1 dòng chi tiết (chiTietId).</summary>
        Task<GioHangDto> UpdateItemQuantityAsync(Guid nguoiDungId, Guid chiTietId, int soLuong);

        /// <summary>Xoá 1 dòng chi tiết.</summary>
        Task<GioHangDto> RemoveItemAsync(Guid nguoiDungId, Guid chiTietId);

        /// <summary>Xoá hết giỏ hàng.</summary>
        Task ClearCartAsync(Guid nguoiDungId);
    }
}
