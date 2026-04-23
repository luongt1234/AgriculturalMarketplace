using AgroMarket.Application.DTOs.ThongKe;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AgroMarket.Application.Services
{
    public class ThongKeService : IThongKeService
    {
        private readonly IRepository<AgroMarket.Domain.Entities.DonHang> _donHangRepo;
        private readonly IRepository<AgroMarket.Domain.Entities.SanPhamDang> _sanPhamRepo;
        private readonly IRepository<AgroMarket.Domain.Entities.NguoiDung> _nguoiDungRepo;

        public ThongKeService(
            IRepository<AgroMarket.Domain.Entities.DonHang> donHangRepo,
            IRepository<AgroMarket.Domain.Entities.SanPhamDang> sanPhamRepo,
            IRepository<AgroMarket.Domain.Entities.NguoiDung> nguoiDungRepo)
        {
            _donHangRepo = donHangRepo;
            _sanPhamRepo = sanPhamRepo;
            _nguoiDungRepo = nguoiDungRepo;
        }

        public async Task<FarmerDashboardStatsDto> GetFarmerStatsAsync(Guid farmerId)
        {
            var donHangQuery = _donHangRepo.GetQueryable()
                .Where(x => x.NguoiBanId == farmerId);

            var sanPhamQuery = _sanPhamRepo.GetQueryable()
                .Where(x => x.NguoiBanId == farmerId && !x.IsDeleted);

            // 1. Tổng doanh thu (Các đơn hoàn thành hoặc đã giao)
            var tongDoanhThu = await donHangQuery
                .Where(x => x.TrangThai == TrangThaiDonHang.HoanTat)
                .SumAsync(x => x.TongTien + x.PhiVanChuyen);

            // 2. Đơn chờ xử lý
            var donChoXuLy = await donHangQuery
                .CountAsync(x => x.TrangThai == TrangThaiDonHang.ChoXuLy);

            // Đơn mới hôm nay
            var today = DateTime.UtcNow.Date;
            var donMoiNhat = await donHangQuery
                .CountAsync(x => x.NgayTao >= today);

            // 3. Sản phẩm sắp hết (dưới 10)
            var sanPhamSapHet = await sanPhamQuery
                .CountAsync(x => x.SoLuong < 10);

            // 4. Đánh giá Shop (Tạm fake 4.8 vì chưa có bảng DanhGia mapping đủ)
            // Lấy thực tế từ entity DanhGia nếu bạn có entity tương ứng
            var danhGiaShop = 4.8m;

            return new FarmerDashboardStatsDto
            {
                TongDoanhThu = tongDoanhThu,
                BieuDoDoanhThu_TangGiamPhanTram = 12, // Fake 12%
                DonChoXuLy = donChoXuLy,
                DonMoiNhat = donMoiNhat,
                SanPhamSapHet = sanPhamSapHet,
                DanhGiaShop = danhGiaShop
            };
        }

        public async Task<AdminDashboardStatsDto> GetAdminStatsAsync()
        {
            var donHangQuery = _donHangRepo.GetQueryable();
            var nguoiDungQuery = _nguoiDungRepo.GetQueryable();

            // 1. Tổng GMV (Tất cả đơn hoàn thành)
            var tongGmv = await donHangQuery
                .Where(x => x.TrangThai == TrangThaiDonHang.HoanTat)
                .SumAsync(x => x.TongTien + x.PhiVanChuyen);

            // 2. Doanh thu thuần (Ví dụ 8% của GMV)
            var doanhThuThuan = tongGmv * 0.08m;

            // 3. Người bán hoạt động (tạm đếm toàn bộ active users)
            var nguoiBanHoatDong = await nguoiDungQuery
                .CountAsync(x => x.KichHoat == true && !x.IsDeleted);

            // 4. Người dùng mới trong ngày
            var today = DateTime.UtcNow.Date;
            var nguoiDungMoi = await nguoiDungQuery
                .CountAsync(x => x.NgayTao >= today);

            return new AdminDashboardStatsDto
            {
                TongGmv = tongGmv,
                DoanhThuThuan = doanhThuThuan,
                NguoiBanHoatDong = nguoiBanHoatDong,
                NguoiDungMoi = nguoiDungMoi
            };
        }
    }
}
