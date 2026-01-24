using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class HopDongBaoTieu : BaseEntity
    {
        public Guid NongDanId { get; set; }
        [ForeignKey("NongDanId")]
        public virtual NguoiDung NongDan { get; set; } = null!;

        public Guid DoanhNghiepId { get; set; }
        [ForeignKey("DoanhNghiepId")]
        public virtual NguoiDung DoanhNghiep { get; set; } = null!;

        public Guid SanPhamDangId { get; set; } // spd_id
        [ForeignKey("SanPhamDangId")]
        public virtual SanPhamDang SanPhamDang { get; set; } = null!;

        public int SanLuongCamKet { get; set; } // san_luong_cam_ket
        public decimal GiaChot { get; set; }    // gia_chot
        public DateTime NgayThuHoachDuKien { get; set; } // ngay_thu_hoach_du_kien

        public TrangThaiHopDong TrangThai { get; set; } = TrangThaiHopDong.DeNghi;
        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
    }
}