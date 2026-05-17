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
                AnhBiaUrl = BuildImageUrl(seller.AnhBiaUrl),
                MoTaCuaHang = seller.MoTaCuaHang,
                DiaChi = seller.DiaChi,
                SoDienThoai = seller.SoDienThoai,
                DiemUyTin = seller.DiemUyTin,
                NgayThamGia = seller.NgayTao,
                SoSanPham = soSanPham,
                SoNguoiTheoDoi = soNguoiTheoDoi,
                DangTheoDoi = dangTheoDoi,
            };
        }

        // ─── Search ──────────────────────────────────────────────────────────
        public async Task<(List<SellerProfileDto> Items, int Total)> SearchSellersAsync(string keyword, int page = 1, int pageSize = 10)
        {
            var query = _nguoiDungRepo.GetAll()
                .Where(u => u.KichHoat && u.CacSanPham.Any())
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var term = keyword.ToLower();
                query = query.Where(u => 
                    u.HoTen.ToLower().Contains(term) || 
                    (u.MoTaCuaHang != null && u.MoTaCuaHang.ToLower().Contains(term)));
            }

            var total = await query.CountAsync();

            var sellers = await query
                .OrderByDescending(u => u.DiemUyTin) // Ưu tiên gian hàng uy tín
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(u => u.CacSanPham) // Để đếm sản phẩm
                .ToListAsync();

            // Lấy số lượng theo dõi
            var sellerIds = sellers.Select(s => s.Id).ToList();
            var followCounts = await _theoDoiRepo.GetAll()
                .Where(td => sellerIds.Contains(td.NguoiBanId))
                .GroupBy(td => td.NguoiBanId)
                .Select(g => new { SellerId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.SellerId, x => x.Count);

            var items = sellers.Select(seller => new SellerProfileDto
            {
                Id = seller.Id,
                HoTen = seller.HoTen,
                AnhDaiDienUrl = BuildImageUrl(seller.AnhDaiDienUrl),
                AnhBiaUrl = BuildImageUrl(seller.AnhBiaUrl),
                MoTaCuaHang = seller.MoTaCuaHang,
                DiaChi = seller.DiaChi,
                SoDienThoai = seller.SoDienThoai,
                DiemUyTin = seller.DiemUyTin,
                NgayThamGia = seller.NgayTao,
                SoSanPham = seller.CacSanPham.Count(sp => !sp.IsDeleted),
                SoNguoiTheoDoi = followCounts.ContainsKey(seller.Id) ? followCounts[seller.Id] : 0,
                DangTheoDoi = false // Trong search thường không cần hiển thị trạng thái theo dõi cá nhân ngay lập tức, hoặc có thể làm sau
            }).ToList();

            return (items, total);
        }

        public async Task<(List<SellerProfileDto> Items, int Total)> GetFollowedSellersAsync(Guid userId, int page = 1, int pageSize = 10)
        {
            var query = _theoDoiRepo.GetAll()
                .Where(td => !td.IsDeleted && td.NguoiTheoDoiId == userId)
                .AsQueryable();

            var total = await query.CountAsync();

            var followedRecords = await query
                .OrderByDescending(td => td.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (!followedRecords.Any())
                return (new List<SellerProfileDto>(), total);

            var sellerIds = followedRecords.Select(td => td.NguoiBanId).ToList();

            var sellers = await _nguoiDungRepo.GetAll()
                .Where(u => sellerIds.Contains(u.Id))
                .Include(u => u.CacSanPham)
                .ToListAsync();

            var followCounts = await _theoDoiRepo.GetAll()
                .Where(td => !td.IsDeleted && sellerIds.Contains(td.NguoiBanId))
                .GroupBy(td => td.NguoiBanId)
                .Select(g => new { SellerId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.SellerId, x => x.Count);

            // Xắp xếp lại theo thứ tự `followedRecords`
            var items = new List<SellerProfileDto>();
            foreach (var record in followedRecords)
            {
                var seller = sellers.FirstOrDefault(s => s.Id == record.NguoiBanId);
                if (seller == null) continue;

                items.Add(new SellerProfileDto
                {
                    Id = seller.Id,
                    HoTen = seller.HoTen,
                    AnhDaiDienUrl = BuildImageUrl(seller.AnhDaiDienUrl),
                    AnhBiaUrl = BuildImageUrl(seller.AnhBiaUrl),
                    MoTaCuaHang = seller.MoTaCuaHang,
                    DiaChi = seller.DiaChi,
                    SoDienThoai = seller.SoDienThoai,
                    DiemUyTin = seller.DiemUyTin,
                    NgayThamGia = seller.NgayTao,
                    SoSanPham = seller.CacSanPham.Count(sp => !sp.IsDeleted),
                    SoNguoiTheoDoi = followCounts.ContainsKey(seller.Id) ? followCounts[seller.Id] : 0,
                    DangTheoDoi = true // Vì đang ở danh sách đã theo dõi
                });
            }

            return (items, total);
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
                .OrderByDescending(sp => sp.IsGhim)
                .ThenByDescending(sp => sp.NgayDang)
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
                IsGhim = sp.IsGhim,
                NgayDang = sp.NgayDang,
            }).ToList();

            return (dtos, total);
        }

        // ─── Settings ────────────────────────────────────────────────────────
        public async Task<StoreSettingsDto?> GetMyShopAsync(Guid sellerId)
        {
            var seller = await _nguoiDungRepo.GetByIdAsync(sellerId);
            if (seller is null) return null;

            return new StoreSettingsDto
            {
                HoTen = seller.HoTen,
                AnhDaiDienUrl = seller.AnhDaiDienUrl,
                AnhBiaUrl = seller.AnhBiaUrl,
                MoTaCuaHang = seller.MoTaCuaHang,
                DiaChi = seller.DiaChi,
                SoDienThoai = seller.SoDienThoai
            };
        }

        public async Task UpdateMyShopAsync(Guid sellerId, StoreSettingsDto dto)
        {
            var seller = await _nguoiDungRepo.GetByIdAsync(sellerId);
            if (seller is null) throw new Exception("Không tìm thấy người bán");

            seller.HoTen = dto.HoTen;
            seller.AnhDaiDienUrl = dto.AnhDaiDienUrl;
            seller.AnhBiaUrl = dto.AnhBiaUrl;
            seller.MoTaCuaHang = dto.MoTaCuaHang;
            seller.DiaChi = dto.DiaChi;
            seller.SoDienThoai = dto.SoDienThoai;

            _nguoiDungRepo.Update(seller);
            await _uow.CommitAsync();
        }

        // ─── Follow ───────────────────────────────────────────────────────────
        public async Task TheoDoiAsync(Guid nguoiTheoDoiId, Guid nguoiBanId)
        {
            if (nguoiTheoDoiId == nguoiBanId)
                throw new InvalidOperationException("Không thể theo dõi chính mình.");

            var record = await _theoDoiRepo.GetQueryable()
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(td => td.NguoiTheoDoiId == nguoiTheoDoiId && td.NguoiBanId == nguoiBanId);

            if (record != null)
            {
                if (record.IsDeleted)
                {
                    record.IsDeleted = false;
                    record.NgayTao = DateTime.UtcNow; // Cập nhật lại ngày theo dõi
                    _theoDoiRepo.Update(record);
                    await _uow.CommitAsync();
                }
                return; // already following — idempotent
            }

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
                .AnyAsync(td => !td.IsDeleted && td.NguoiTheoDoiId == nguoiTheoDoiId && td.NguoiBanId == nguoiBanId);
        }

        // ─── Helper ──────────────────────────────────────────────────────────
        private static string? BuildImageUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return null;
            return url.StartsWith("http") ? url : $"{BaseImageUrl}{url}";
        }
    }
}
