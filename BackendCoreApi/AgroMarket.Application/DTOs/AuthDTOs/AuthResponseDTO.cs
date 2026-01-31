namespace AgroMarket.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public Guid Id { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? SoDienThoai { get; set; }
        public string? AnhDaiDienUrl { get; set; }

        public Guid VaiTroId { get; set; }
        public string TenVaiTro { get; set; } = string.Empty;
        public decimal SoDu { get; set; }
    }
}