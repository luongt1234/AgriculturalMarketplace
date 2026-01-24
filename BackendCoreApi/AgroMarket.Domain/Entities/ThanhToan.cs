using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class ThanhToan : BaseEntity
    {
        public Guid DonHangId { get; set; } // don_hang_id
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        public PhuongThucThanhToan PhuongThuc { get; set; } // phuong_thuc
        public decimal SoTien { get; set; } // so_tien
        public TrangThaiThanhToan TrangThai { get; set; } // trang_thai
        public DateTime? NgayThanhToan { get; set; } // ngay_thanh_toan
    }
}