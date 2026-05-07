using System.Text.Json.Serialization;

namespace AgroMarket.Application.DTOs.MoMoDtos
{
    /// <summary>Response từ MoMo sau khi tạo yêu cầu thanh toán</summary>
    public class MoMoCreatePaymentResponse
    {
        [JsonPropertyName("partnerCode")]
        public string PartnerCode { get; set; } = string.Empty;

        [JsonPropertyName("orderId")]
        public string OrderId { get; set; } = string.Empty;

        [JsonPropertyName("requestId")]
        public string RequestId { get; set; } = string.Empty;

        [JsonPropertyName("amount")]
        public long Amount { get; set; }

        [JsonPropertyName("responseTime")]
        public long ResponseTime { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("resultCode")]
        public int ResultCode { get; set; }

        /// <summary>URL thanh toán (mở trình duyệt)</summary>
        [JsonPropertyName("payUrl")]
        public string PayUrl { get; set; } = string.Empty;

        /// <summary>Chuỗi QR EMVCO để render QR code</summary>
        [JsonPropertyName("qrCodeUrl")]
        public string QrCodeUrl { get; set; } = string.Empty;

        /// <summary>Deep link mở app MoMo trực tiếp</summary>
        [JsonPropertyName("deeplink")]
        public string Deeplink { get; set; } = string.Empty;

        public bool IsSuccess => ResultCode == 0;
    }

    /// <summary>Payload IPN từ MoMo gửi về khi buyer thanh toán xong</summary>
    public class MoMoIpnPayload
    {
        [JsonPropertyName("partnerCode")]
        public string PartnerCode { get; set; } = string.Empty;

        [JsonPropertyName("orderId")]
        public string OrderId { get; set; } = string.Empty;

        [JsonPropertyName("requestId")]
        public string RequestId { get; set; } = string.Empty;

        [JsonPropertyName("amount")]
        public long Amount { get; set; }

        [JsonPropertyName("orderInfo")]
        public string OrderInfo { get; set; } = string.Empty;

        [JsonPropertyName("orderType")]
        public string OrderType { get; set; } = string.Empty;

        [JsonPropertyName("transId")]
        public long TransId { get; set; }

        [JsonPropertyName("resultCode")]
        public int ResultCode { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("payType")]
        public string PayType { get; set; } = string.Empty;

        [JsonPropertyName("responseTime")]
        public long ResponseTime { get; set; }

        [JsonPropertyName("extraData")]
        public string ExtraData { get; set; } = string.Empty;

        [JsonPropertyName("signature")]
        public string Signature { get; set; } = string.Empty;

        public bool IsSuccess => ResultCode == 0;
    }
}
