using AgroMarket.Domain.Entities;

namespace AgroMarket.Application.DTOs.DanhMucDtos
{
    public class DanhMucFormDto
    {
        public Guid Id { get; set; }
        //public string Loai { get; set; } = null!; // cot: loai (Vd: LOAI_SP, DON_VI)
        public string MaGiaTri { get; set; } = null!; // cot: ma_gia_tri
        public string TenHienThi { get; set; } = null!; // cot: ten_hien_thi
        public Guid LoaiDanhMucId { get; set; }
        public Guid? DanhMucCapTrenId { get; set; }
        public string? Icon { get; set; }
        public int ThuTu { get; set; } = 0;       // cot: thu_tu
    }
}
