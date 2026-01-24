using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class SanPhamChung : BaseEntity
    {
        public string TenSanPham { get; set; } = null!; // ten_san_pham
        public string? MoTa { get; set; }  // mo_ta

        public Guid DonViId { get; set; } // don_vi_id
        [ForeignKey("DonViId")]
        public virtual DanhMuc DonVi { get; set; } = null!;

        public Guid? DanhMucId { get; set; } // loai_id (FK tới DanhMuc type=LOAI_SP)
        [ForeignKey("DanhMucId")]
        public virtual DanhMuc? DanhMuc { get; set; }

        public Guid? ChaId { get; set; } // parent_id (Đệ quy)
        [ForeignKey("ChaId")]
        public virtual SanPhamChung? Cha { get; set; }
    }
}