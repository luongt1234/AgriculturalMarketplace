namespace AgroMarket.Application.DTOs.GioHangDtos
{
    public class ChiTietGioHangDto
    {
        public Guid Id { get; set; }
        public Guid SanPhamDangId { get; set; }
        public string? TenSanPham { get; set; }
        public string? HinhAnhUrl { get; set; }
        public decimal Gia { get; set; }
        public int SoLuong { get; set; }
        public string? DonVi { get; set; }
        public Guid NguoiBanId { get; set; }
        public string? TenNguoiBan { get; set; }
        public decimal ThanhTien => Gia * SoLuong;
    }

    public class GioHangDto
    {
        public Guid Id { get; set; }
        public Guid NguoiDungId { get; set; }
        public List<ChiTietGioHangDto> ChiTiet { get; set; } = new();
        public decimal TongTien => ChiTiet.Sum(c => c.ThanhTien);
    }

    /// <summary>Thêm hoặc cập nhật 1 sản phẩm vào giỏ.</summary>
    public class ThemVaoGioHangDto
    {
        public Guid SanPhamDangId { get; set; }
        public int SoLuong { get; set; } = 1;
    }

    /// <summary>Cập nhật số lượng của 1 dòng chi tiết.</summary>
    public class CapNhatSoLuongDto
    {
        public int SoLuong { get; set; }
    }
}
