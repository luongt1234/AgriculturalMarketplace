using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class ChiTietGioHang : BaseEntity
    {
        public Guid GioHangId { get; set; }

        [ForeignKey("GioHangId")]
        public virtual GioHang GioHang { get; set; } = null!;

        public Guid SanPhamDangId { get; set; }

        [ForeignKey("SanPhamDangId")]
        public virtual SanPhamDang SanPhamDang { get; set; } = null!;

        public int SoLuong { get; set; } = 1;
    }
}
