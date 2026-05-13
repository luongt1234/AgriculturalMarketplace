using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class AdminChucNangPhanQuyen : BaseEntity
    {
        public Guid NguoiDungId { get; set; }

        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        public string MaChucNang { get; set; } = string.Empty;
    }
}
