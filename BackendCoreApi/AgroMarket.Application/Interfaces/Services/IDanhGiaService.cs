using AgroMarket.Application.DTOs.DanhGiaDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IDanhGiaService
    {
        /// <summary>Lấy danh sách + thống kê đánh giá của một sản phẩm.</summary>
        Task<ReviewSummaryDto> GetReviewsBySanPhamAsync(
            Guid sanPhamDangId,
            int pageNumber = 1,
            int pageSize   = 10,
            int? filterSao = null);

        /// <summary>Buyer gửi đánh giá. Ném InvalidOperationException nếu vi phạm business rule.</summary>
        Task<DanhGiaDto> TaoDanhGiaAsync(Guid buyerId, TaoDanhGiaRequest request);

        /// <summary>Kiểm tra buyer có thể đánh giá đơn hàng / sản phẩm này không.</summary>
        Task<CoTheDanhGiaDto> KiemTraCoTheDanhGiaAsync(
            Guid buyerId, Guid donHangId, Guid sanPhamDangId);
    }
}
