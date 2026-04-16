namespace AgroMarket.Application.DTOs.TinNhanDtos
{
    public class TinNhanDto
    {
        public Guid Id { get; set; }
        public Guid NguoiGuiId { get; set; }
        public Guid NguoiNhanId { get; set; }
        public string NoiDung { get; set; } = null!;
        public DateTime ThoiGian { get; set; }
        public string TrangThai { get; set; } = "ChuaDoc";

        // Thông tin người gửi (để hiển thị bubble)
        public string? TenNguoiGui { get; set; }
        public string? AnhDaiDienNguoiGui { get; set; }
    }
}
