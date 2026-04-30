using AgroMarket.Application.DTOs.GiaoHangNhanhDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace AgroMarket.Application.Services
{
    public class GhnWebhookService : IGhnWebhookService
    {
        private readonly IDonHangRepository _donHangRepository;
        private readonly ILogger<GhnWebhookService> _logger;

        public GhnWebhookService(
            IDonHangRepository donHangRepository,
            ILogger<GhnWebhookService> logger)
        {
            _donHangRepository = donHangRepository;
            _logger = logger;
        }

        public async Task<string> ProcessStatusUpdateAsync(GhnWebhookPayload payload)
        {
            _logger.LogInformation("GHN Webhook: OrderCode={OrderCode}, Status={Status}",
                payload.OrderCode, payload.Status);

            // 1. Tìm đơn hàng theo mã vận đơn GHN
            var donHang = await _donHangRepository.GetByMaVanDonAsync(payload.OrderCode);
            if (donHang == null)
            {
                _logger.LogWarning("GHN Webhook: Không tìm thấy đơn hàng với mã vận đơn {OrderCode}", payload.OrderCode);
                return "Không tìm thấy đơn hàng, bỏ qua.";
            }

            // 2. Map trạng thái GHN → trạng thái hệ thống
            var newStatus = MapGhnStatus(payload.Status);
            if (newStatus == null)
            {
                _logger.LogInformation("GHN Webhook: Trạng thái '{Status}' không cần xử lý.", payload.Status);
                return "Trạng thái không cần xử lý.";
            }

            // 3. Chỉ cập nhật nếu trạng thái thực sự thay đổi
            if (donHang.TrangThai == newStatus.Value)
                return "Trạng thái không đổi.";

            donHang.TrangThai = newStatus.Value;
            donHang.NgayChinhSua = DateTime.UtcNow;
            await _donHangRepository.UpdateAsync(donHang);

            _logger.LogInformation("GHN Webhook: Cập nhật đơn {OrderCode} → {Status}", payload.OrderCode, newStatus.Value);
            return "Cập nhật trạng thái thành công.";
        }

        /// <summary>
        /// Map mã trạng thái GHN → TrangThaiDonHang nội bộ.
        /// Tham khảo: https://api.ghn.vn/home/docs/detail?id=41
        /// </summary>
        private static TrangThaiDonHang? MapGhnStatus(string? ghnStatus) => ghnStatus?.ToLower() switch
        {
            "ready_to_pick"       => TrangThaiDonHang.DangGiao,
            "picking"             => TrangThaiDonHang.DangGiao,
            "picked"              => TrangThaiDonHang.DangGiao,
            "storing"             => TrangThaiDonHang.DangGiao,
            "transporting"        => TrangThaiDonHang.DangGiao,
            "delivering"          => TrangThaiDonHang.DangGiao,
            "delivery_fail"       => TrangThaiDonHang.DangGiao,   // GHN thử lại
            "delivered"           => TrangThaiDonHang.DaGiao,
            "cancel"              => TrangThaiDonHang.Huy,
            "return"              => TrangThaiDonHang.YeuCauHoan,
            "return_transporting" => TrangThaiDonHang.DangHoan,
            "returned"            => TrangThaiDonHang.DaHoan,
            _                     => null                           // Bỏ qua
        };
    }
}
