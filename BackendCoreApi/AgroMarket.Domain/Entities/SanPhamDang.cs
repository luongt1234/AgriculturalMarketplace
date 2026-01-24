using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class SanPhamDang : BaseEntity
    {
        public string? TenHienThi { get; set; } // ten_san_pham (Tên riêng người bán đặt)

        public Guid SanPhamChungId { get; set; } // spc_id
        [ForeignKey("SanPhamChungId")]
        public virtual SanPhamChung SanPhamChung { get; set; } = null!;

        public Guid NguoiBanId { get; set; } // user_id / nguoi_ban_id
        [ForeignKey("NguoiBanId")]
        public virtual NguoiDung NguoiBan { get; set; } = null!;

        public Guid? ChatLuongId { get; set; } // chat_luong_id (FK tới DanhMuc)
        [ForeignKey("ChatLuongId")]
        public virtual DanhMuc? ChatLuong { get; set; }

        public decimal Gia { get; set; }      // gia
        public int SoLuong { get; set; }       // so_luong

        public TrangThaiSanPham TrangThai { get; set; } = TrangThaiSanPham.ConHang; // trang_thai

        public string? HinhAnhUrl { get; set; }   // hinh_anh
        public string? MoTaChiTiet { get; set; } // mo_ta
        public DateTime NgayDang { get; set; } = DateTime.UtcNow; // ngay_dang
    }
}