using AgroMarket.Application.DTOs.TinNhanDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ITinNhanService
    {
        /// <summary>
        /// Lấy danh sách cuộc hội thoại của một user (grouped by pair)
        /// </summary>
        Task<List<CuocTroChuyenDto>> GetCuocTroChuyenAsync(Guid userId);

        /// <summary>
        /// Lấy lịch sử tin nhắn giữa 2 user (có phân trang)
        /// </summary>
        Task<List<TinNhanDto>> GetLichSuTinNhanAsync(Guid userId, Guid otherUserId, int page = 1, int pageSize = 30);

        /// <summary>
        /// Lưu tin nhắn vào DB và trả về DTO (được gọi từ Hub hoặc Controller)
        /// </summary>
        Task<TinNhanDto> GuiTinNhanAsync(GuiTinNhanDto request, Guid senderId);

        /// <summary>
        /// Đánh dấu tất cả tin nhắn từ otherUser gửi đến userId là đã đọc
        /// </summary>
        Task DanhDauDaDocAsync(Guid userId, Guid otherUserId);

        /// <summary>
        /// Đếm tổng số tin chưa đọc của user
        /// </summary>
        Task<int> DemTinChuaDocAsync(Guid userId);
    }
}
