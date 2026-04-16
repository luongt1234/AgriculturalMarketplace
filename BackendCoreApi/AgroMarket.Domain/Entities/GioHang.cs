using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class GioHang : BaseEntity
    {
        public Guid NguoiDungId { get; set; }

        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        public virtual ICollection<ChiTietGioHang> ChiTiet { get; set; } = new List<ChiTietGioHang>();
    }
}
