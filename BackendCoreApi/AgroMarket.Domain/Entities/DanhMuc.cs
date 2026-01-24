using AgroMarket.Domain.Common;

namespace AgroMarket.Domain.Entities
{
    public class DanhMuc : BaseEntity
    {
        public string Loai { get; set; } = null!; // cot: loai (Vd: LOAI_SP, DON_VI)
        public string MaGiaTri { get; set; } = null!; // cot: ma_gia_tri
        public string TenHienThi { get; set; } = null!; // cot: ten_hien_thi
        public int ThuTu { get; set; } = 0;       // cot: thu_tu
    }
}