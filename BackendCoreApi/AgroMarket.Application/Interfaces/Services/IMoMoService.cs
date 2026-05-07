using AgroMarket.Application.DTOs.MoMoDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IMoMoService
    {
        /// <summary>
        /// Tạo yêu cầu thanh toán MoMo và lấy QR code / payUrl.
        /// </summary>
        Task<MoMoCreatePaymentResponse> TaoThanhToanAsync(
            string orderId,
            long amount,
            string orderInfo,
            string requestId);

        /// <summary>
        /// Hoàn tiền cho người dùng thông qua MoMo Refund API.
        /// </summary>
        Task<bool> HoanTienAsync(
            string orderId,
            string transId,
            long amount,
            string description);

        /// <summary>
        /// Xác thực chữ ký HMAC-SHA256 từ IPN payload gửi về.
        /// </summary>
        bool XacThucChuKyIpn(MoMoIpnPayload payload);
    }
}
