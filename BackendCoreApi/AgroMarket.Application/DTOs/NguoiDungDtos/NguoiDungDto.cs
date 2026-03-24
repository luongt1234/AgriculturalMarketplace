using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.DTOs.NguoiDungDtos
{
    public class NguoiDungDto
    {
        public Guid Id { get; set; }
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? AnhDaiDienUrl { get; set; }

        public string? ThongTinNganHang { get; set; }

        // Tài chính
        public decimal SoDu { get; set; }
        public decimal SoDuChoXuLy { get; set; }

        // Vai trò
        public Guid VaiTroId { get; set; }
        public string? TenVaiTro { get; set; }

        public int DiemUyTin { get; set; }
        public bool KichHoat { get; set; }

        // Audit (nếu BaseEntity có)
        public DateTime? NgayTao { get; set; }
        public DateTime? NgayChinhSua { get; set; }
    }
}
