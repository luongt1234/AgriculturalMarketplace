using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class SanPhamYeuThich : BaseEntity
    {
        public Guid NguoiDungId { get; set; }
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        public Guid SanPhamDangId { get; set; }
        [ForeignKey("SanPhamDangId")]
        public virtual SanPhamDang SanPhamDang { get; set; } = null!;
    }
}
