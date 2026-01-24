using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class ThongBao : BaseEntity
    {
        public Guid NguoiNhanId { get; set; } // user_id
        [ForeignKey("NguoiNhanId")]
        public virtual NguoiDung NguoiNhan { get; set; } = null!;

        public string TieuDe { get; set; } = null!; // tieu_de
        public string NoiDung { get; set; } = null!; // noi_dung
        public bool DaXem { get; set; } = false; // da_xem
        public string? LoaiThongBao { get; set; } // loai_thong_bao (System, Order, etc.)
        public string? LienKet { get; set; } // link (dẫn tới đơn hàng/sản phẩm)
    }
}