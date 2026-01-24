using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class ChiTietDonHang : BaseEntity
    {
        public Guid DonHangId { get; set; } // don_hang_id
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        public Guid SanPhamDangId { get; set; } // spd_id
        [ForeignKey("SanPhamDangId")]
        public virtual SanPhamDang SanPhamDang { get; set; } = null!;

        public int SoLuong { get; set; } // so_luong
        public decimal DonGia { get; set; } // don_gia
    }
}