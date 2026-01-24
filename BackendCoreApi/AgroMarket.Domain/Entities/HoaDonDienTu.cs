using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class HoaDonDienTu : BaseEntity
    {
        public Guid DonHangId { get; set; }
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        public DateTime NgayXuat { get; set; } = DateTime.UtcNow; // ngay_xuat
        public string? MaSoThue { get; set; }      // ma_so_thue
        public string? DuongDanPdf { get; set; }   // duong_dan_pdf
    }
}