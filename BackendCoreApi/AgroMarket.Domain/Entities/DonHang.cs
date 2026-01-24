using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class DonHang : BaseEntity
    {
        public Guid NguoiMuaId { get; set; } // nguoi_mua_id
        [ForeignKey("NguoiMuaId")]
        public virtual NguoiDung NguoiMua { get; set; } = null!;

        public Guid NguoiBanId { get; set; } // nguoi_ban_id
        [ForeignKey("NguoiBanId")]
        public virtual NguoiDung NguoiBan { get; set; } = null!;

        public decimal TongTien { get; set; } // tong_tien

        public TrangThaiDonHang TrangThai { get; set; } = TrangThaiDonHang.ChoXuLy;

        public string? GhiChu { get; set; } // ghi_chu_mua

        public PhuongThucGiaoHang PhuongThucNhanHang { get; set; } = PhuongThucGiaoHang.TaiKho; // phuong_thuc_nhan_hang
        public bool IsDatHangTruoc { get; set; } = false; // is_dat_hang (Pre-order)

        // Navigation
        public virtual ICollection<ChiTietDonHang> ChiTietDonHang { get; set; } = new List<ChiTietDonHang>();
        public virtual ICollection<ThanhToan> CacThanhToan { get; set; } = new List<ThanhToan>();
    }
}