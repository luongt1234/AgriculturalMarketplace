using AgroMarket.Api.Hubs;
using AgroMarket.Application.DTOs.MoMoDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace AgroMarket.Api.Controllers
{
    /// <summary>
    /// Tiếp nhận IPN (Instant Payment Notification) từ MoMo sau khi buyer thanh toán.
    /// Cấu hình IPN URL này trong MoMo Dashboard: /api/webhooks/momo
    /// </summary>
    [ApiController]
    [Route("api/webhooks/momo")]
    public class MoMoWebhookController : ControllerBase
    {
        private readonly IMoMoService _momoService;
        private readonly IDonHangRepository _donHangRepository;
        private readonly IHubContext<OrderHub> _orderHub;
        private readonly ILogger<MoMoWebhookController> _logger;

        public MoMoWebhookController(
            IMoMoService momoService,
            IDonHangRepository donHangRepository,
            IHubContext<OrderHub> orderHub,
            ILogger<MoMoWebhookController> logger)
        {
            _momoService       = momoService;
            _donHangRepository = donHangRepository;
            _orderHub          = orderHub;
            _logger            = logger;
        }

        [HttpPost]
        public async Task<IActionResult> ReceiveIpn([FromBody] MoMoIpnPayload payload)
        {
            _logger.LogInformation("MoMo IPN received: orderId={OrderId}, resultCode={Code}",
                payload.OrderId, payload.ResultCode);

            // 1. Xác thực chữ ký HMAC-SHA256
            if (!_momoService.XacThucChuKyIpn(payload))
            {
                _logger.LogWarning("MoMo IPN: Chữ ký không hợp lệ cho orderId={OrderId}", payload.OrderId);
                return BadRequest(new { message = "Chữ ký không hợp lệ." });
            }

            // 2. Tìm đơn hàng (orderId từ MoMo = donHangId của hệ thống)
            if (!Guid.TryParse(payload.OrderId, out var donHangId))
                return BadRequest(new { message = "OrderId không hợp lệ." });

            var donHang = await _donHangRepository.GetByIdWithDetailsAsync(donHangId);
            if (donHang == null)
            {
                _logger.LogWarning("MoMo IPN: Không tìm thấy đơn hàng {DonHangId}", donHangId);
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            // 3. Xử lý kết quả thanh toán
            if (payload.IsSuccess)
            {
                // Thanh toán thành công: lưu transId, chuyển sang ChoXuLy
                donHang.MoMoTransId = payload.TransId;
                donHang.TrangThai   = TrangThaiDonHang.ChoXuLy;
                donHang.NgayChinhSua = DateTime.UtcNow;
                await _donHangRepository.UpdateAsync(donHang);

                // Push SignalR đến buyer để đóng modal QR
                await _orderHub.Clients
                    .Group(OrderHub.UserGroup(donHang.NguoiMuaId))
                    .SendAsync("MomoPaymentSuccess", new
                    {
                        donHangId = donHang.Id,
                        transId   = payload.TransId,
                        message   = "Thanh toán MoMo thành công!"
                    });

                // Push SignalR đến seller thông báo đơn mới
                await _orderHub.Clients
                    .Group(OrderHub.UserGroup(donHang.NguoiBanId))
                    .SendAsync("NewOrder", new
                    {
                        donHangId     = donHang.Id,
                        tongThanhToan = donHang.TongThanhToan,
                        ngayTao       = donHang.NgayTao,
                        trangThai     = donHang.TrangThai.ToString()
                    });

                _logger.LogInformation("MoMo IPN: Đơn {DonHangId} đã thanh toán. TransId={TransId}",
                    donHangId, payload.TransId);
            }
            else
            {
                // Thanh toán thất bại: hủy đơn
                donHang.TrangThai = TrangThaiDonHang.Huy;
                donHang.NgayChinhSua = DateTime.UtcNow;
                await _donHangRepository.UpdateAsync(donHang);

                await _orderHub.Clients
                    .Group(OrderHub.UserGroup(donHang.NguoiMuaId))
                    .SendAsync("MomoPaymentFailed", new
                    {
                        donHangId = donHang.Id,
                        message   = $"Thanh toán MoMo thất bại: {payload.Message}"
                    });

                _logger.LogWarning("MoMo IPN: Đơn {DonHangId} thanh toán thất bại. Code={Code}, Msg={Msg}",
                    donHangId, payload.ResultCode, payload.Message);
            }

            // MoMo yêu cầu trả về 200 để xác nhận đã nhận IPN
            return Ok(new { message = "IPN received." });
        }
    }
}
