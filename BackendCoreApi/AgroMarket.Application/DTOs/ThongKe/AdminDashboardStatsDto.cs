using System;

namespace AgroMarket.Application.DTOs.ThongKe
{
    public class AdminDashboardStatsDto
    {
        public decimal TongGmv { get; set; }
        public decimal DoanhThuThuan { get; set; } // Giả định bằng GMV * 0.08 (8% phí nền tảng)
        public int NguoiBanHoatDong { get; set; }
        public int NguoiDungMoi { get; set; }
    }
}
