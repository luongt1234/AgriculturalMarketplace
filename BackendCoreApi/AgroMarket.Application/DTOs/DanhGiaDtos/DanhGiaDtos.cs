namespace AgroMarket.Application.DTOs.DanhGiaDtos
{
    // ── Request: Buyer gửi đánh giá ─────────────────────────────────────────────
    public class TaoDanhGiaRequest
    {
        public Guid DonHangId { get; set; }
        public Guid SanPhamDangId { get; set; }
        /// <summary>1 – 5</summary>
        public int SoSao { get; set; }
        public string? BinhLuan { get; set; }
    }

    // ── Response: Một đánh giá ───────────────────────────────────────────────────
    public class DanhGiaDto
    {
        public Guid Id { get; set; }
        public Guid NguoiDanhGiaId { get; set; }
        public string TenNguoiDanhGia { get; set; } = string.Empty;
        public string? AnhDaiDienUrl { get; set; }
        public int SoSao { get; set; }
        public string? BinhLuan { get; set; }
        public DateTime NgayTao { get; set; }
        public Guid DonHangId { get; set; }
        public Guid SanPhamDangId { get; set; }
    }

    // ── Response: Tổng hợp cho một sản phẩm ────────────────────────────────────
    public class ReviewSummaryDto
    {
        public double DiemTrungBinh { get; set; }
        public int TongSoDanhGia { get; set; }
        /// <summary>Index 0 = 1 sao … Index 4 = 5 sao</summary>
        public int[] PhanBoSao { get; set; } = new int[5];
        public List<DanhGiaDto> DanhGias { get; set; } = new();
        public int TrangHienTai { get; set; }
        public int TongTrang { get; set; }
    }

    // ── Response: Kiểm tra có thể đánh giá ─────────────────────────────────────
    public class CoTheDanhGiaDto
    {
        public bool CoThe { get; set; }
        /// <summary>"ok" | "order_not_completed" | "already_reviewed" | "not_owner"</summary>
        public string LyDo { get; set; } = "ok";
    }
}
