using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
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

        // ── Helper: map label ────────────────────────────────────────────────────
        private static string GetLabel(TrangThaiDonHang t) => t switch
        {
            TrangThaiDonHang.ChoXuLy    => "Chờ xử lý",
            TrangThaiDonHang.XacNhan    => "Đã xác nhận",
            TrangThaiDonHang.Huy        => "Đã hủy",
            TrangThaiDonHang.DangGiao   => "Đang giao",
            TrangThaiDonHang.DaGiao     => "Đã giao",
            TrangThaiDonHang.HoanTat    => "Hoàn tất",
            TrangThaiDonHang.YeuCauHoan => "Yêu cầu hoàn trả",
            TrangThaiDonHang.DangHoan   => "Đang hoàn hàng",
            TrangThaiDonHang.DaHoan     => "Đã hoàn hàng",
            TrangThaiDonHang.TraChanh   => "Tranh chấp",
            _                           => t.ToString()
        };

        private static DonHangDto MapDto(DonHang dh) => new()
        {
            Id               = dh.Id,
            NgayTao          = dh.NgayTao,
            NguoiMuaId       = dh.NguoiMuaId,
            NguoiBanId       = dh.NguoiBanId,
            TenNguoiBan      = dh.NguoiBan?.HoTen,
            AnhDaiDienNguoiBan = dh.NguoiBan?.AnhDaiDienUrl,
            TongTien         = dh.TongTien,
            PhiVanChuyen     = dh.PhiVanChuyen,
            TrangThai        = dh.TrangThai,
            TrangThaiLabel   = GetLabel(dh.TrangThai),
            DiaChiGiaoHang   = dh.DiaChiGiaoHang,
            GhiChu           = dh.GhiChu,
            ChiTiet = dh.ChiTietDonHang.Select(ct => new ChiTietDonHangDto
            {
                Id            = ct.Id,
                SanPhamDangId = ct.SanPhamDangId,
                TenSanPham    = ct.SanPhamDang?.TenHienThi,
                HinhAnhUrl    = ct.SanPhamDang?.HinhAnhUrl,
                SoLuong       = ct.SoLuong,
                DonGia        = ct.DonGia
            }).ToList()
        };

        // ── Buyer: lấy đơn của mình ──────────────────────────────────────────────
        public async Task<(IEnumerable<DonHangDto> Items, int TotalRecords)> GetByNguoiMuaPagedAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null)
        {
            var query = _context.DonHangs
                .Include(dh => dh.NguoiBan)
                .Include(dh => dh.ChiTietDonHang).ThenInclude(ct => ct.SanPhamDang)
                .Where(dh => dh.NguoiMuaId == nguoiMuaId)
                .AsQueryable();

            if (trangThai.HasValue)
                query = query.Where(dh => dh.TrangThai == trangThai.Value);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(dh => dh.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items.Select(MapDto), total);
        }

        // ── Seller: lấy đơn của shop mình ───────────────────────────────────────
        public async Task<(IEnumerable<DonHangDto> Items, int TotalRecords)> GetByNguoiBanPagedAsync(
            Guid nguoiBanId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null)
        {
            var query = _context.DonHangs
                .Include(dh => dh.NguoiBan)
                .Include(dh => dh.NguoiMua)
                .Include(dh => dh.ChiTietDonHang).ThenInclude(ct => ct.SanPhamDang)
                .Where(dh => dh.NguoiBanId == nguoiBanId)
                .AsQueryable();

            if (trangThai.HasValue)
                query = query.Where(dh => dh.TrangThai == trangThai.Value);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(dh => dh.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items.Select(MapDto), total);
        }

        // ── Tạo đơn hàng mới ────────────────────────────────────────────────────
        public async Task<DonHang> TaoDonHangAsync(DonHang donHang, List<ChiTietDonHang> chiTiet)
        {
            _context.DonHangs.Add(donHang);
            await _context.SaveChangesAsync();

            foreach (var ct in chiTiet)
            {
                ct.DonHangId = donHang.Id;
                _context.ChiTietDonHangs.Add(ct);
            }
            await _context.SaveChangesAsync();

            // Reload with full navigation
            return await _context.DonHangs
                .Include(dh => dh.ChiTietDonHang)
                .Include(dh => dh.NguoiBan)
                .FirstAsync(dh => dh.Id == donHang.Id);
        }

        // ── Lấy đơn theo Id ─────────────────────────────────────────────────────
        public async Task<DonHang?> GetByIdWithDetailsAsync(Guid donHangId)
        {
            return await _context.DonHangs
                .Include(dh => dh.NguoiBan)
                .Include(dh => dh.NguoiMua)
                .Include(dh => dh.ChiTietDonHang).ThenInclude(ct => ct.SanPhamDang)
                .FirstOrDefaultAsync(dh => dh.Id == donHangId);
        }

        // ── Cập nhật trạng thái ──────────────────────────────────────────────────
        public async Task<bool> CapNhatTrangThaiAsync(Guid donHangId, TrangThaiDonHang trangThai, Guid actorId)
        {
            var donHang = await _context.DonHangs.FindAsync(donHangId);
            if (donHang == null) return false;

            donHang.TrangThai = trangThai;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
