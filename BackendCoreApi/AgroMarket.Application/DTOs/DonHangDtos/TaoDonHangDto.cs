using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.DTOs.DonHangDtos
{
    // ── Request gửi từ FE lên khi buyer bấm "Đặt hàng" ─────────────────────────
    public class TaoDonHangRequest
    {
        /// <summary>Id bản ghi DiaChiNguoiDung đã lưu</summary>
        public string DiaChiGiaoHangId { get; set; } = string.Empty;

        /// <summary>JSON blob địa chỉ đầy đủ (stringify từ FE)</summary>
        public string DiaChiGiaoHang { get; set; } = string.Empty;

        /// <summary>Tên người nhận</summary>
        public string TenNguoiNhan { get; set; } = string.Empty;

        /// <summary>SĐT người nhận</summary>
        public string SoDienThoai { get; set; } = string.Empty;

        /// <summary>Id người bán (tất cả item trong đơn cùng 1 seller)</summary>
        public Guid NguoiBanId { get; set; }

        /// <summary>Phí vận chuyển (đã tính từ GHN)</summary>
        public decimal PhiVanChuyen { get; set; }

        /// <summary>Mã dịch vụ GHN (serviceId)</summary>
        public int? GhnServiceId { get; set; }

        /// <summary>Ghi chú của buyer</summary>
        public string? GhiChu { get; set; }

        /// <summary>Phương thức thanh toán: COD hoặc MoMo (ví nội bộ)</summary>
        public PhuongThucThanhToan PhuongThucThanhToan { get; set; } = PhuongThucThanhToan.COD;

        /// <summary>Danh sách sản phẩm trong đơn (đã nhóm theo seller)</summary>
        public List<ChiTietDonHangRequest> Items { get; set; } = new();
    }

    public class ChiTietDonHangRequest
    {
        public Guid SanPhamDangId { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    // ── Kết quả trả về sau khi tạo đơn thành công ───────────────────────────────
    public class TaoDonHangResponse
    {
        public Guid DonHangId { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public decimal PhiVanChuyen { get; set; }
        public decimal TongThanhToan { get; set; }
        public DateTime NgayTao { get; set; }

        /// <summary>URL trang thanh toán MoMo (mở browser) — chỉ có khi dùng MoMo</summary>
        public string? MomoPayUrl { get; set; }

        /// <summary>Chuỗi QR EMVCO để render QR code — chỉ có khi dùng MoMo</summary>
        public string? MomoQrCodeUrl { get; set; }
    }
}
