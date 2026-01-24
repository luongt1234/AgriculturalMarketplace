using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class NguoiDung : BaseEntity
    {
        public string TenDangNhap { get; set; } = null!; // username
        public string MatKhauHash { get; set; } = null!; // password_hash
        public string HoTen { get; set; } = null!; // ho_ten
        public string Email { get; set; } = null!;
        public string? SoDienThoai { get; set; } // so_dien_thoai
        public string? DiaChi { get; set; }     // dia_chi
        public string? AnhDaiDienUrl { get; set; }   // anh_dai_dien_url
        public string? ThongTinNganHang { get; set; } // thong_tin_ngan_hang (JSON)

        // Tài chính
        public decimal SoDu { get; set; } = 0; // so_du
        public decimal SoDuChoXuLy { get; set; } = 0; // so_du_cho_xu_ly

        // Foreign Key: Vai trò
        public Guid VaiTroId { get; set; }
        [ForeignKey("VaiTroId")]
        public virtual DanhMuc VaiTro { get; set; } = null!;

        public int DiemUyTin { get; set; } = 0; // diem_uy_tin
        public bool KichHoat { get; set; } = true;    // trang_thai / is_active

        // Navigation
        public virtual ICollection<SanPhamDang> CacSanPham { get; set; } = new List<SanPhamDang>();
        public virtual ICollection<DonHang> DonHangMua { get; set; } = new List<DonHang>();
        public virtual ICollection<DonHang> DonHangBan { get; set; } = new List<DonHang>();
    }
}