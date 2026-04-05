using System;

namespace AgroMarket.Application.DTOs.SanPhamDangDtos
{
    public class SanPhamDangDto
    {
        public Guid Id { get; set; }
        public string? TenHienThi { get; set; }
        public decimal Gia { get; set; }
        public int SoLuong { get; set; }
        public string TrangThai { get; set; }
        public string? HinhAnhUrl { get; set; }
        public string? MoTaChiTiet { get; set; }
        public DateTime NgayDang { get; set; }
        public Guid SanPhamChungId { get; set; }
        public Guid NguoiBanId { get; set; }
        public Guid? ChatLuongId { get; set; }
        public string? TenSanPhamChung { get; set; }
        public string? TenNguoiBan { get; set; }
        public string? AnhDaiDienNguoiBan { get; set; }
        public string? TenChatLuong { get; set; }

        public Guid? DonViId { get; set; }
        public string? TenDonVi { get; set; } 

        public Guid? LoaiId { get; set; }
        public string? TenLoai { get; set; }
        public byte[]? AnhSanPham { get; set; }
        // Thuộc tính tính toán cho thuật toán hiển thị
        public double DisplayScore { get; set; }
        public bool IsFeatured { get; set; }
    }
}