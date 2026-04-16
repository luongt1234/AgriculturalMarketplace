using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.CuaHangDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Application.Services
{
    public class CuaHangService : ICuaHangService
    {
        private readonly IRepository<NguoiDung> _nguoiDungRepo;
        private readonly IRepository<SanPhamDang> _sanPhamRepo;
        private readonly IRepository<TheoDoiNguoiBan> _theoDoiRepo;
        private readonly IUnitOfWork _uow;

        private const string BaseImageUrl = "http://localhost:5182";

        public CuaHangService(
            IRepository<NguoiDung> nguoiDungRepo,
            IRepository<SanPhamDang> sanPhamRepo,
            IRepository<TheoDoiNguoiBan> theoDoiRepo,
            IUnitOfWork uow)
        {
            _nguoiDungRepo = nguoiDungRepo;
            _sanPhamRepo = sanPhamRepo;
            _theoDoiRepo = theoDoiRepo;
            _uow = uow;
        }

        // ─── Profile ─────────────────────────────────────────────────────────
        public async Task<SellerProfileDto?> GetSellerProfileAsync(Guid sellerId, Guid? currentUserId = null)
        {
            var seller = await _nguoiDungRepo.GetByIdAsync(sellerId);
            if (seller is null || !seller.KichHoat) return null;

            var soSanPham = await _sanPhamRepo.GetAll()
                .CountAsync(sp => sp.NguoiBanId == sellerId);

            var soNguoiTheoDoi = await _theoDoiRepo.GetAll()
                .CountAsync(td => td.NguoiBanId == sellerId);

            var dangTheoDoi = currentUserId.HasValue &&
                await _theoDoiRepo.GetAll()
                    .AnyAsync(td => td.NguoiTheoDoiId == currentUserId.Value && td.NguoiBanId == sellerId);

            return new SellerProfileDto
            {
                Id = seller.Id,
                HoTen = seller.HoTen,
                AnhDaiDienUrl = BuildImageUrl(seller.AnhDaiDienUrl),
                DiaChi = seller.DiaChi,
                SoDienThoai = seller.SoDienThoai,
                DiemUyTin = seller.DiemUyTin,
                NgayThamGia = seller.NgayTao,
                SoSanPham = soSanPham,
                SoNguoiTheoDoi = soNguoiTheoDoi,
                DangTheoDoi = dangTheoDoi,
            };
        }

        // ─── Products paged ───────────────────────────────────────────────────
        public async Task<(List<SanPhamCuaHangDto> Items, int Total)> GetSellerProductsAsync(
            Guid sellerId,
            int page,
            int pageSize,
            string? search = null,
            string? tenSanPhamChung = null)
        {
            var query = _sanPhamRepo.GetAll()
                .Where(sp => sp.NguoiBanId == sellerId)
                .Include(sp => sp.SanPhamChung)
                    .ThenInclude(spc => spc.DonVi)
                .Include(sp => sp.ChatLuong)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(sp => sp.TenHienThi != null && sp.TenHienThi.Contains(search));

            if (!string.IsNullOrWhiteSpace(tenSanPhamChung))
                query = query.Where(sp => sp.SanPhamChung.TenSanPham.Contains(tenSanPhamChung));

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(sp => sp.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(sp => new SanPhamCuaHangDto
            {
                Id = sp.Id,
                TenHienThi = sp.TenHienThi ?? string.Empty,
                HinhAnhUrl = BuildImageUrl(sp.HinhAnhUrl),
                Gia = sp.Gia,
                TenDonVi = sp.SanPhamChung?.DonVi?.MaGiaTri,
                TenChatLuong = sp.ChatLuong?.MaGiaTri,
                TenSanPhamChung = sp.SanPhamChung?.TenSanPham,
                SoLuong = sp.SoLuong,
                TrangThai = sp.TrangThai.ToString(),
                NgayDang = sp.NgayDang,
            }).ToList();

            return (dtos, total);
        }

        // ─── Follow ───────────────────────────────────────────────────────────
        public async Task TheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId)
        {
            if (nguoiTheoDoiId == nguoiBanId)
                throw new InvalidOperationException("Không thể theo dõi chính mình.");

            var exists = await _theoDoiRepo.GetAll()
                .AnyAsync(td => td.NguoiTheoDoiId == nguoiTheoDoiId && td.NguoiBanId == nguoiBanId);

            if (exists) return; // already following — idempotent

            _theoDoiRepo.Add(new TheoDoiNguoiBan
            {
                Id = Guid.NewGuid(),
                NguoiTheoDoiId = nguoiTheoDoiId,
                NguoiBanId = nguoiBanId,
                NgayTao = DateTime.UtcNow,
            });
            await _uow.CommitAsync();
        }

        // ─── Unfollow ─────────────────────────────────────────────────────────
        public async Task HuyTheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId)
        {
            var record = await _theoDoiRepo.GetAll()
                .FirstOrDefaultAsync(td => td.NguoiTheoDoiId == nguoiTheoDoiId && td.NguoiBanId == nguoiBanId);

            if (record is null) return;

            record.IsDeleted = true;
            _theoDoiRepo.Update(record);
            await _uow.CommitAsync();
        }

        // ─── Check ───────────────────────────────────────────────────────────
        public async Task<bool> IsTheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId)
        {
            return await _theoDoiRepo.GetAll()
                .AnyAsync(td => td.NguoiTheoDoiId == nguoiTheoDoiId && td.NguoiBanId == nguoiBanId);
        }

        // ─── Helper ──────────────────────────────────────────────────────────
        private static string? BuildImageUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return null;
            return url.StartsWith("http") ? url : $"{BaseImageUrl}{url}";
        }
    }
}
