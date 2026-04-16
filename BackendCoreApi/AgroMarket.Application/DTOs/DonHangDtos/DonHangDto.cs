using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.DTOs.DonHangDtos
{
    public class ChiTietDonHangDto
    {
        public Guid Id { get; set; }
        public Guid SanPhamDangId { get; set; }
        public string? TenSanPham { get; set; }
        public string? HinhAnhUrl { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien => SoLuong * DonGia;
    }

    public class DonHangDto
    {
        public Guid Id { get; set; }
        public DateTime NgayTao { get; set; }
        public Guid NguoiMuaId { get; set; }
        public Guid NguoiBanId { get; set; }
        public string? TenNguoiBan { get; set; }
        public string? AnhDaiDienNguoiBan { get; set; }
        public decimal TongTien { get; set; }
        public decimal PhiVanChuyen { get; set; }
        public decimal TongThanhToan => TongTien + PhiVanChuyen;
        public TrangThaiDonHang TrangThai { get; set; }
        public string? TrangThaiLabel { get; set; }
        public string? DiaChiGiaoHang { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietDonHangDto> ChiTiet { get; set; } = new();
    }
}
