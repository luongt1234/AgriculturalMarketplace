using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Enums;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Repositories
{
    public class DonHangRepository : IDonHangRepository
    {
        private readonly AppDbContext _context;

        public DonHangRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<DonHangDto> Items, int TotalRecords)> GetByNguoiMuaPagedAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null)
        {
            var query = _context.DonHangs
                .Include(dh => dh.NguoiBan)
                .Include(dh => dh.ChiTietDonHang)
                    .ThenInclude(ct => ct.SanPhamDang)
                .Where(dh => dh.NguoiMuaId == nguoiMuaId)
                .AsQueryable();

            if (trangThai.HasValue)
                query = query.Where(dh => dh.TrangThai == trangThai.Value);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(dh => dh.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(dh => new DonHangDto
                {
                    Id = dh.Id,
                    NgayTao = dh.NgayTao,
                    NguoiMuaId = dh.NguoiMuaId,
                    NguoiBanId = dh.NguoiBanId,
                    TenNguoiBan = dh.NguoiBan.HoTen,
                    AnhDaiDienNguoiBan = dh.NguoiBan.AnhDaiDienUrl,
                    TongTien = dh.TongTien,
                    PhiVanChuyen = dh.PhiVanChuyen,
                    TrangThai = dh.TrangThai,
                    TrangThaiLabel = dh.TrangThai == TrangThaiDonHang.ChoXuLy ? "Chờ xử lý" :
                                     dh.TrangThai == TrangThaiDonHang.XacNhan ? "Đã xác nhận" :
                                     dh.TrangThai == TrangThaiDonHang.DangGiao ? "Đang giao" :
                                     dh.TrangThai == TrangThaiDonHang.HoanTat ? "Hoàn tất" :
                                     "Đã hủy",
                    DiaChiGiaoHang = dh.DiaChiGiaoHang,
                    GhiChu = dh.GhiChu,
                    ChiTiet = dh.ChiTietDonHang.Select(ct => new ChiTietDonHangDto
                    {
                        Id = ct.Id,
                        SanPhamDangId = ct.SanPhamDangId,
                        TenSanPham = ct.SanPhamDang.TenHienThi,
                        HinhAnhUrl = ct.SanPhamDang.HinhAnhUrl,
                        SoLuong = ct.SoLuong,
                        DonGia = ct.DonGia
                    }).ToList()
                })
                .ToListAsync();

            return (items, total);
        }
    }
}
