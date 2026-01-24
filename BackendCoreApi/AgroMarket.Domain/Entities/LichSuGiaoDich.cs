using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class LichSuGiaoDich : BaseEntity
    {
        public Guid DonHangId { get; set; }
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        public Guid? ThanhToanId { get; set; }
        [ForeignKey("ThanhToanId")]
        public virtual ThanhToan? ThanhToan { get; set; }

        public string HanhDong { get; set; } = null!; // hanh_dong (Vd: "Cập nhật trạng thái")
        public string? MoTa { get; set; }             // mo_ta
        public DateTime ThoiGian { get; set; } = DateTime.UtcNow; // thoi_gian

        public Guid? ThucHienBoiId { get; set; } // thuc_hien_boi
        [ForeignKey("ThucHienBoiId")]
        public virtual NguoiDung? NguoiThucHien { get; set; }
    }
}