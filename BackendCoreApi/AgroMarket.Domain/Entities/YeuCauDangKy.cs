using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Domain.Entities
{
    public class YeuCauDangKy : BaseEntity
    {
        public string TenDoanhNghiep { get; set; } = null!;
        public string MaSoThue { get; set; } = null!;
        public string NguoiDaiDien { get; set; } = null!;
        public string EmailLienHe { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string DiaChiTruSo { get; set; } = null!;
        public string? GiayPhepKinhDoanhUrl { get; set; }

        public TrangThaiYeuCau TrangThai { get; set; } = TrangThaiYeuCau.ChoDuyet;

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
        public DateTime? NgayDuyet { get; set; }
    }
}