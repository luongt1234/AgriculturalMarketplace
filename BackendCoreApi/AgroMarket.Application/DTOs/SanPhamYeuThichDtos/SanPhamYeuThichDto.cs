using System;

namespace AgroMarket.Application.DTOs.SanPhamYeuThichDtos
{
    public class SanPhamYeuThichDto
    {
        public Guid SanPhamYeuThichId { get; set; }
        public Guid SanPhamDangId { get; set; }
        public string TenHienThi { get; set; } = null!;
        public decimal Gia { get; set; }
        public string? HinhAnhUrl { get; set; }
        public Guid NguoiBanId { get; set; }
        public string? TenCuaHang { get; set; }
        public DateTime NgayYeuThich { get; set; }
    }
}
