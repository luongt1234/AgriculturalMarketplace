namespace AgroMarket.Application.DTOs.CuaHangDtos
{
    /// <summary>Thông tin tổng quan của cửa hàng người bán</summary>
    public class SellerProfileDto
    {
        public Guid Id { get; set; }
        public string HoTen { get; set; } = null!;
        public string? AnhDaiDienUrl { get; set; }
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
        public string? AnhBiaUrl { get; set; }
        public string? MoTaCuaHang { get; set; }
        public int DiemUyTin { get; set; }
        public DateTime NgayThamGia { get; set; }

        // Thống kê (computed)
        public int SoSanPham { get; set; }
        public int SoNguoiTheoDoi { get; set; }
        public bool DangTheoDoi { get; set; }    // dành cho user đã đăng nhập
        public double DanhGiaTrungBinh { get; set; } = 4.8; // lấy từ DanhGia sau
        public int TiLePhanhHoi { get; set; } = 98;          // placeholder
    }

    /// <summary>Card sản phẩm hiển thị trên trang cửa hàng</summary>
    public class SanPhamCuaHangDto
    {
        public Guid Id { get; set; }
        public string TenHienThi { get; set; } = null!;
        public string? HinhAnhUrl { get; set; }
        public decimal Gia { get; set; }
        public string? TenDonVi { get; set; }
        public string? TenChatLuong { get; set; }
        public string? TenSanPhamChung { get; set; }
        public int SoLuong { get; set; }
        public string TrangThai { get; set; } = null!;
        public bool IsGhim { get; set; }
        public DateTime NgayDang { get; set; }
    }

    /// <summary>Config của shop</summary>
    public class StoreSettingsDto
    {
        public string HoTen { get; set; } = null!;
        public string? AnhDaiDienUrl { get; set; }
        public string? AnhBiaUrl { get; set; }
        public string? MoTaCuaHang { get; set; }
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
    }
}
