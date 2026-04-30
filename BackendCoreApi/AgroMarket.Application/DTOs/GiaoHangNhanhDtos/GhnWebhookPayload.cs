using System.Text.Json.Serialization;

namespace AgroMarket.Application.DTOs.GiaoHangNhanhDtos
{
    /// <summary>
    /// Model nhận Webhook từ Giao Hàng Nhanh (GHN).
    /// Tham khảo đầy đủ: https://api.ghn.vn/home/docs/detail?id=41
    /// </summary>
    public class GhnWebhookPayload
    {
        /// <summary>Mã vận đơn GHN, ví dụ: LHRGPG</summary>
        [JsonPropertyName("OrderCode")]
        public string OrderCode { get; set; } = string.Empty;

        /// <summary>Trạng thái đơn: ready_to_pick, picking, delivering, delivered, cancel, returned...</summary>
        [JsonPropertyName("Status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("CODAmount")]
        public int? CodAmount { get; set; }

        [JsonPropertyName("CODTransferDate")]
        public string? CodTransferDate { get; set; }

        [JsonPropertyName("Weight")]
        public int? Weight { get; set; }

        [JsonPropertyName("Description")]
        public string? Description { get; set; }
    }
}
