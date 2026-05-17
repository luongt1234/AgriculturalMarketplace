using AgroMarket.Application.DTOs.DanhGiaDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Services
{
    public class DanhGiaService : IDanhGiaService
    {
        private readonly AppDbContext _db;

        public DanhGiaService(AppDbContext db)
        {
            _db = db;
        }

        // ── Helper: Map entity → DTO ─────────────────────────────────────────────
        private static DanhGiaDto MapDto(DanhGia dg, string baseUrl = "") => new()
        {
            Id                = dg.Id,
            NguoiDanhGiaId    = dg.NguoiDanhGiaId,
            TenNguoiDanhGia   = dg.NguoiDanhGia?.HoTen ?? "Người dùng",
            AnhDaiDienUrl     = dg.NguoiDanhGia?.AnhDaiDienUrl,
            SoSao             = dg.SoSao,
            BinhLuan          = dg.BinhLuan,
            NgayTao           = dg.NgayTao,
            DonHangId         = dg.DonHangId,
            SanPhamDangId     = dg.SanPhamDangId,
        };

        // ── GET: Đánh giá theo sản phẩm ─────────────────────────────────────────
        public async Task<ReviewSummaryDto> GetReviewsBySanPhamAsync(
            Guid sanPhamDangId,
            int pageNumber = 1,
            int pageSize   = 10,
            int? filterSao = null)
        {
            var query = _db.DanhGias
                .Include(dg => dg.NguoiDanhGia)
                .Where(dg => dg.SanPhamDangId == sanPhamDangId)
                .AsQueryable();

            // Thống kê tổng (không filter sao)
            var allReviews = await _db.DanhGias
                .Where(dg => dg.SanPhamDangId == sanPhamDangId)
                .Select(dg => dg.SoSao)
                .ToListAsync();

            var tongSo      = allReviews.Count;
            var trungBinh   = tongSo > 0 ? Math.Round(allReviews.Average(), 1) : 0.0;
            var phanBo      = new int[5];
            foreach (var s in allReviews)
                if (s >= 1 && s <= 5) phanBo[s - 1]++;

            // Filter theo sao nếu có
            if (filterSao.HasValue && filterSao >= 1 && filterSao <= 5)
                query = query.Where(dg => dg.SoSao == filterSao.Value);

            var filteredTotal = await query.CountAsync();
            var totalPages    = (int)Math.Ceiling(filteredTotal / (double)pageSize);

            var items = await query
                .OrderByDescending(dg => dg.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new ReviewSummaryDto
            {
                DiemTrungBinh  = trungBinh,
                TongSoDanhGia  = tongSo,
                PhanBoSao      = phanBo,
                DanhGias       = items.Select(dg => MapDto(dg)).ToList(),
                TrangHienTai   = pageNumber,
                TongTrang      = totalPages,
            };
        }

        // ── POST: Tạo đánh giá ──────────────────────────────────────────────────
        public async Task<DanhGiaDto> TaoDanhGiaAsync(Guid buyerId, TaoDanhGiaRequest request)
        {
            // 1. Lấy đơn hàng
            var donHang = await _db.DonHangs
                .Include(dh => dh.ChiTietDonHang)
                .FirstOrDefaultAsync(dh => dh.Id == request.DonHangId)
                ?? throw new InvalidOperationException("Không tìm thấy đơn hàng.");

            // 2. Kiểm tra người mua
            if (donHang.NguoiMuaId != buyerId)
                throw new InvalidOperationException("Bạn không có quyền đánh giá đơn hàng này.");

            // 3. Kiểm tra trạng thái HoanTat
            if (donHang.TrangThai != TrangThaiDonHang.HoanTat)
                throw new InvalidOperationException("Chỉ có thể đánh giá khi đơn hàng đã hoàn tất.");

            // 4. Kiểm tra sản phẩm có trong đơn hàng
            var coTrongDon = donHang.ChiTietDonHang.Any(ct => ct.SanPhamDangId == request.SanPhamDangId);
            if (!coTrongDon)
                throw new InvalidOperationException("Sản phẩm không thuộc đơn hàng này.");

            // 5. Kiểm tra chưa đánh giá
            var daDanhGia = await _db.DanhGias.AnyAsync(dg =>
                dg.DonHangId == request.DonHangId &&
                dg.SanPhamDangId == request.SanPhamDangId);
            if (daDanhGia)
                throw new InvalidOperationException("Bạn đã đánh giá sản phẩm này trong đơn hàng rồi.");

            // 6. Validate sao
            if (request.SoSao < 1 || request.SoSao > 5)
                throw new InvalidOperationException("Số sao phải từ 1 đến 5.");

            // 7. Tạo đánh giá
            var danhGia = new DanhGia
            {
                Id               = Guid.NewGuid(),
                DonHangId        = request.DonHangId,
                SanPhamDangId    = request.SanPhamDangId,
                NguoiDanhGiaId   = buyerId,
                NguoiBiDanhGiaId = donHang.NguoiBanId,
                SoSao            = request.SoSao,
                BinhLuan         = request.BinhLuan?.Trim(),
                NgayTao          = DateTime.UtcNow,
            };

            _db.DanhGias.Add(danhGia);
            await _db.SaveChangesAsync();

            // Load lại để có navigation property
            await _db.Entry(danhGia).Reference(dg => dg.NguoiDanhGia).LoadAsync();

            return MapDto(danhGia);
        }

        // ── GET: Kiểm tra có thể đánh giá ───────────────────────────────────────
        public async Task<CoTheDanhGiaDto> KiemTraCoTheDanhGiaAsync(
            Guid buyerId, Guid donHangId, Guid sanPhamDangId)
        {
            var donHang = await _db.DonHangs
                .Include(dh => dh.ChiTietDonHang)
                .FirstOrDefaultAsync(dh => dh.Id == donHangId);

            if (donHang == null)
                return new CoTheDanhGiaDto { CoThe = false, LyDo = "not_owner" };

            if (donHang.NguoiMuaId != buyerId)
                return new CoTheDanhGiaDto { CoThe = false, LyDo = "not_owner" };

            if (donHang.TrangThai != TrangThaiDonHang.HoanTat)
                return new CoTheDanhGiaDto { CoThe = false, LyDo = "order_not_completed" };

            var daDanhGia = await _db.DanhGias.AnyAsync(dg =>
                dg.DonHangId == donHangId &&
                dg.SanPhamDangId == sanPhamDangId);
            if (daDanhGia)
                return new CoTheDanhGiaDto { CoThe = false, LyDo = "already_reviewed" };

            return new CoTheDanhGiaDto { CoThe = true, LyDo = "ok" };
        }
    }
}
