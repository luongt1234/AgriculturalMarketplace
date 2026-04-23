using System;

namespace AgroMarket.Application.DTOs.ThongKe
{
    public class FarmerDashboardStatsDto
    {
        public decimal TongDoanhThu { get; set; }
        public int BieuDoDoanhThu_TangGiamPhanTram { get; set; } // Giả lập tỷ lệ % tăng giảm
        public int DonChoXuLy { get; set; }
        public int DonMoiNhat { get; set; } // Để hiển thị 'mới hôm nay'
        public int SanPhamSapHet { get; set; }
        public decimal DanhGiaShop { get; set; }
    }
}
