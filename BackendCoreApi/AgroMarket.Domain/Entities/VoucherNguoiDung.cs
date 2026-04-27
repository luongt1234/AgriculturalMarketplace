using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class VoucherNguoiDung : BaseEntity
    {
        public Guid VoucherId { get; set; }
        [ForeignKey("VoucherId")]
        public virtual Voucher Voucher { get; set; } = null!;

        public Guid NguoiDungId { get; set; }
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        public DateTime NgayLay { get; set; } = DateTime.UtcNow;
        public bool DaDung { get; set; } = false;
        public DateTime? NgayDung { get; set; }
    }
}
