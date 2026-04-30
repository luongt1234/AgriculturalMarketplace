using AgroMarket.Application.DTOs.GiaoHangNhanhDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IGhnWebhookService
    {
        /// <summary>
        /// Xử lý cập nhật trạng thái vận đơn từ GHN.
        /// </summary>
        /// <param name="payload">Dữ liệu GHN gửi về</param>
        /// <returns>Thông báo kết quả</returns>
        Task<string> ProcessStatusUpdateAsync(GhnWebhookPayload payload);
    }
}
