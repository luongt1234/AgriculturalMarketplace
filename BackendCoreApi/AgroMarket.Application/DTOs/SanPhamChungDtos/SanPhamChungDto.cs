namespace AgroMarket.Application.DTOs.SanPhamChuDtos
{
    public class SanPhamChungDto
    {
        public Guid id { get; set; }
        public string TenSanPham { get; set; }
        public Guid? loai_id { get; set; }
        public string? MoTa { get; set; }
        public Guid DonViId { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public Guid? ChaId { get; set; }
        public List<SanPhamChungDto>? sanPhamCons { get; set; }
    }
}
