using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using AgroMarket.Application.DTOs.MoMoDtos;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AgroMarket.Infrastructure.Services
{
    public class MoMoService : IMoMoService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<MoMoService> _logger;

        // Sandbox credentials
        private readonly string _partnerCode;
        private readonly string _accessKey;
        private readonly string _secretKey;
        private readonly string _apiUrl;
        private readonly string _ipnUrl;
        private readonly string _redirectUrl;

        public MoMoService(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<MoMoService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;

            var cfg = configuration.GetSection("MoMoConfig");
            _partnerCode  = cfg["PartnerCode"]  ?? "MOMO";
            _accessKey    = cfg["AccessKey"]    ?? "F8BBA842ECF85";
            _secretKey    = cfg["SecretKey"]    ?? "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            _apiUrl       = cfg["ApiUrl"]       ?? "https://test-payment.momo.vn/v2/gateway/api/create";
            _ipnUrl       = cfg["IpnUrl"]       ?? "https://localhost:7001/api/webhooks/momo";
            _redirectUrl  = cfg["RedirectUrl"]  ?? "http://localhost:5173/orders";
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Tạo chữ ký HMAC-SHA256
        // ─────────────────────────────────────────────────────────────────────────
        private string TaoChuKy(string rawData)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Tạo yêu cầu thanh toán → lấy QR + payUrl
        // ─────────────────────────────────────────────────────────────────────────
        public async Task<MoMoCreatePaymentResponse> TaoThanhToanAsync(
            string orderId,
            long amount,
            string orderInfo,
            string requestId)
        {
            var extraDataJson = "{\"orderId\":\"" + orderId + "\"}";
            var extraData = Convert.ToBase64String(Encoding.UTF8.GetBytes(extraDataJson));

            // Tạo raw string để ký theo đúng thứ tự MoMo yêu cầu
            var rawSignature =
                $"accessKey={_accessKey}" +
                $"&amount={amount}" +
                $"&extraData={extraData}" +
                $"&ipnUrl={_ipnUrl}" +
                $"&orderId={orderId}" +
                $"&orderInfo={orderInfo}" +
                $"&partnerCode={_partnerCode}" +
                $"&redirectUrl={_redirectUrl}" +
                $"&requestId={requestId}" +
                $"&requestType=captureWallet";

            var signature = TaoChuKy(rawSignature);

            var payload = new
            {
                partnerCode = _partnerCode,
                accessKey   = _accessKey,
                requestId   = requestId,
                amount      = amount,
                orderId     = orderId,
                orderInfo   = orderInfo,
                redirectUrl = _redirectUrl,
                ipnUrl      = _ipnUrl,
                extraData   = extraData,
                requestType = "captureWallet",
                signature   = signature,
                lang        = "vi"
            };

            var json    = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _logger.LogInformation("MoMo CreatePayment Request: {Payload}", json);

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);
                var httpResponse = await client.PostAsync(_apiUrl, content);
                var responseBody = await httpResponse.Content.ReadAsStringAsync();

                _logger.LogInformation("MoMo CreatePayment Response: {Response}", responseBody);

                var result = JsonSerializer.Deserialize<MoMoCreatePaymentResponse>(responseBody)
                    ?? throw new Exception("Không thể parse response từ MoMo.");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gọi MoMo CreatePayment API");
                throw;
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Hoàn tiền qua MoMo Refund API
        // ─────────────────────────────────────────────────────────────────────────
        public async Task<bool> HoanTienAsync(
            string orderId,
            string transId,
            long amount,
            string description)
        {
            var refundUrl  = "https://test-payment.momo.vn/v2/gateway/api/refund";
            var requestId  = $"REFUND_{orderId}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

            var rawSignature =
                $"accessKey={_accessKey}" +
                $"&amount={amount}" +
                $"&description={description}" +
                $"&orderId={orderId}" +
                $"&partnerCode={_partnerCode}" +
                $"&requestId={requestId}" +
                $"&transId={transId}";

            var signature = TaoChuKy(rawSignature);

            var payload = new
            {
                partnerCode = _partnerCode,
                orderId     = orderId,
                requestId   = requestId,
                amount      = amount,
                transId     = transId,
                lang        = "vi",
                description = description,
                signature   = signature
            };

            var json    = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _logger.LogInformation("MoMo Refund Request: orderId={OrderId}, amount={Amount}", orderId, amount);

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);
                var httpResponse = await client.PostAsync(refundUrl, content);
                var responseBody = await httpResponse.Content.ReadAsStringAsync();

                _logger.LogInformation("MoMo Refund Response: {Response}", responseBody);

                using var doc = JsonDocument.Parse(responseBody);
                var resultCode = doc.RootElement.GetProperty("resultCode").GetInt32();
                return resultCode == 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gọi MoMo Refund API");
                return false;
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Xác thực chữ ký IPN từ MoMo
        // ─────────────────────────────────────────────────────────────────────────
        public bool XacThucChuKyIpn(MoMoIpnPayload payload)
        {
            // MoMo ký IPN với raw string theo thứ tự sau:
            var rawSignature =
                $"accessKey={_accessKey}" +
                $"&amount={payload.Amount}" +
                $"&extraData={payload.ExtraData}" +
                $"&message={payload.Message}" +
                $"&orderId={payload.OrderId}" +
                $"&orderInfo={payload.OrderInfo}" +
                $"&orderType={payload.OrderType}" +
                $"&partnerCode={payload.PartnerCode}" +
                $"&payType={payload.PayType}" +
                $"&requestId={payload.RequestId}" +
                $"&responseTime={payload.ResponseTime}" +
                $"&resultCode={payload.ResultCode}" +
                $"&transId={payload.TransId}";

            var expectedSignature = TaoChuKy(rawSignature);

            var isValid = string.Equals(expectedSignature, payload.Signature, StringComparison.OrdinalIgnoreCase);

            if (!isValid)
            {
                _logger.LogWarning("MoMo IPN chữ ký không hợp lệ. Expected: {Expected}, Got: {Got}",
                    expectedSignature, payload.Signature);
            }

            return isValid;
        }
    }
}
