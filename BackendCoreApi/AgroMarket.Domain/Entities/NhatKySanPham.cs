using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class NhatKySanPham : BaseEntity
    {
        public Guid SanPhamId { get; set; } // san_pham_id
        [ForeignKey("SanPhamId")]
        public virtual SanPhamDang SanPham { get; set; } = null!;

        public string HanhDong { get; set; } = null!; // hanh_dong (Vd: "Gieo hạt", "Bón phân")
        public string? MoTa { get; set; }             // mo_ta
        public string? HinhAnhUrl { get; set; }       // hinh_anh
        public DateTime ThoiGian { get; set; } = DateTime.UtcNow; // thoi_gian

        public Guid NguoiThucHienId { get; set; } // nguoi_thuc_hien_id
        [ForeignKey("NguoiThucHienId")]
        public virtual NguoiDung NguoiThucHien { get; set; } = null!;

        public string? TxHash { get; set; } // tx_hash (Hash giao dịch Blockchain nếu có)
    }
}