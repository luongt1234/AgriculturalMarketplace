using AgroMarket.Application.DTOs.GiaoHangNhanhDtos;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [ApiController]
    [Route("api/webhooks/ghn")]
    public class GhnWebhookController : ControllerBase
    {
        private readonly IGhnWebhookService _webhookService;
        private readonly string _webhookToken;
        private readonly ILogger<GhnWebhookController> _logger;

        public GhnWebhookController(
            IGhnWebhookService webhookService,
            IConfiguration configuration,
            ILogger<GhnWebhookController> logger)
        {
            _webhookService = webhookService;
            _logger = logger;
            _webhookToken = configuration["GHNConfig:WebhookToken"] ?? string.Empty;
        }

        /// <summary>
        /// Nhận cập nhật trạng thái vận đơn từ GHN.
        /// Đặt URL này trong GHN Dashboard → Cài đặt → Webhook.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> ReceiveStatusUpdate([FromBody] GhnWebhookPayload payload)
        {
            // Xác thực token bảo mật từ GHN
            var clientToken = Request.Headers["Token"].ToString();
            if (!string.IsNullOrEmpty(_webhookToken) && clientToken != _webhookToken)
            {
                _logger.LogWarning("GHN Webhook: Token không hợp lệ. Received: {Token}", clientToken);
                return Unauthorized(new { message = "Token không hợp lệ." });
            }

            if (payload == null || string.IsNullOrEmpty(payload.OrderCode))
                return BadRequest(new { message = "Payload không hợp lệ." });

            var result = await _webhookService.ProcessStatusUpdateAsync(payload);
            return Ok(new { message = result });
        }
    }
}
