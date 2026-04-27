using AgroMarket.Application.DTOs.Voucher;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AgroMarket.Infrastructure.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly AppDbContext _context;

        public VoucherService(AppDbContext context)
        {
            _context = context;
        }

        // ─── Admin ───────────────────────────────────────────────────────────
        public async Task<IEnumerable<VoucherDto>> GetAdminVouchersAsync()
        {
            var vouchers = await _context.Vouchers
                .Where(v => v.LoaiVoucher == LoaiVoucher.HE_THONG)
                .OrderByDescending(v => v.NgayTao)
                .ToListAsync();
            return vouchers.Select(MapToDto);
        }

        public async Task<VoucherDto> CreateAdminVoucherAsync(CreateVoucherDto dto)
        {
            var voucher = new Voucher
            {
                MaCode = dto.MaCode.ToUpper().Trim(),
                TenVoucher = dto.TenVoucher,
                MoTa = dto.MoTa,
                LoaiVoucher = LoaiVoucher.HE_THONG,
                LoaiGiamGia = Enum.Parse<LoaiGiamGia>(dto.LoaiGiamGia),
                GiaTriGiam = dto.GiaTriGiam,
                GiaTriGiamToiDa = dto.GiaTriGiamToiDa,
                GiaTriDonHangToiThieu = dto.GiaTriDonHangToiThieu,
                NgayBatDau = dto.NgayBatDau,
                NgayHetHan = dto.NgayHetHan,
                SoLuong = dto.SoLuong,
                ApDungChoIds = dto.ApDungChoIds,
            };
            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();
            return MapToDto(voucher);
        }

        // ─── Farmer ──────────────────────────────────────────────────────────
        public async Task<IEnumerable<VoucherDto>> GetFarmerVouchersAsync(Guid nguoiBanId)
        {
            var vouchers = await _context.Vouchers
                .Where(v => v.LoaiVoucher == LoaiVoucher.CUA_HANG && v.NguoiBanId == nguoiBanId)
                .OrderByDescending(v => v.NgayTao)
                .ToListAsync();
            return vouchers.Select(MapToDto);
        }

        public async Task<VoucherDto> CreateFarmerVoucherAsync(CreateVoucherDto dto, Guid nguoiBanId)
        {
            var voucher = new Voucher
            {
                MaCode = dto.MaCode.ToUpper().Trim(),
                TenVoucher = dto.TenVoucher,
                MoTa = dto.MoTa,
                LoaiVoucher = LoaiVoucher.CUA_HANG,
                LoaiGiamGia = Enum.Parse<LoaiGiamGia>(dto.LoaiGiamGia),
                GiaTriGiam = dto.GiaTriGiam,
                GiaTriGiamToiDa = dto.GiaTriGiamToiDa,
                GiaTriDonHangToiThieu = dto.GiaTriDonHangToiThieu,
                NgayBatDau = dto.NgayBatDau,
                NgayHetHan = dto.NgayHetHan,
                SoLuong = dto.SoLuong,
                NguoiBanId = nguoiBanId,
                ApDungChoIds = dto.ApDungChoIds,
            };
            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();
            return MapToDto(voucher);
        }

        // ─── Shared ──────────────────────────────────────────────────────────
        public async Task<VoucherDto> UpdateVoucherAsync(Guid id, UpdateVoucherDto dto, Guid requestUserId, bool isAdmin)
        {
            var voucher = await _context.Vouchers.FindAsync(id)
                ?? throw new Exception("Voucher không tồn tại.");

            if (!isAdmin && voucher.NguoiBanId != requestUserId)
                throw new UnauthorizedAccessException("Bạn không có quyền sửa voucher này.");

            voucher.TenVoucher = dto.TenVoucher;
            voucher.MoTa = dto.MoTa;
            voucher.GiaTriGiam = dto.GiaTriGiam;
            voucher.GiaTriGiamToiDa = dto.GiaTriGiamToiDa;
            voucher.GiaTriDonHangToiThieu = dto.GiaTriDonHangToiThieu;
            voucher.NgayBatDau = dto.NgayBatDau;
            voucher.NgayHetHan = dto.NgayHetHan;
            voucher.SoLuong = dto.SoLuong;
            voucher.ApDungChoIds = dto.ApDungChoIds;
            voucher.NgayChinhSua = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(voucher);
        }

        public async Task DeleteVoucherAsync(Guid id, Guid requestUserId, bool isAdmin)
        {
            var voucher = await _context.Vouchers.FindAsync(id)
                ?? throw new Exception("Voucher không tồn tại.");

            if (!isAdmin && voucher.NguoiBanId != requestUserId)
                throw new UnauthorizedAccessException("Bạn không có quyền xóa voucher này.");

            voucher.IsDeleted = true;
            voucher.NgayChinhSua = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        // ─── Buyer: Shop Tab ─────────────────────────────────────────────────
        public async Task<IEnumerable<VoucherPublicDto>> GetShopVouchersAsync(Guid sellerId, Guid? currentUserId)
        {
            var now = DateTime.UtcNow;
            var vouchers = await _context.Vouchers
                .Where(v => v.NguoiBanId == sellerId
                         && v.LoaiVoucher == LoaiVoucher.CUA_HANG
                         && v.NgayBatDau <= now
                         && v.NgayHetHan >= now)
                .ToListAsync();

            var claimedIds = new HashSet<Guid>();
            if (currentUserId.HasValue)
            {
                var claimed = await _context.VoucherNguoiDungs
                    .Where(vnd => vnd.NguoiDungId == currentUserId.Value
                               && vouchers.Select(v => v.Id).Contains(vnd.VoucherId))
                    .Select(vnd => vnd.VoucherId)
                    .ToListAsync();
                claimedIds = claimed.ToHashSet();
            }

            return vouchers.Select(v => new VoucherPublicDto
            {
                Id = v.Id,
                MaCode = v.MaCode,
                TenVoucher = v.TenVoucher,
                MoTa = v.MoTa,
                LoaiGiamGia = v.LoaiGiamGia.ToString(),
                GiaTriGiam = v.GiaTriGiam,
                GiaTriGiamToiDa = v.GiaTriGiamToiDa,
                GiaTriDonHangToiThieu = v.GiaTriDonHangToiThieu,
                NgayHetHan = v.NgayHetHan,
                SoLuongConLai = v.SoLuong == -1 ? 9999 : Math.Max(0, v.SoLuong - v.SoLuongDaDung),
                DaLay = claimedIds.Contains(v.Id)
            });
        }

        public async Task<string> ClaimVoucherAsync(Guid voucherId, Guid userId)
        {
            var voucher = await _context.Vouchers.FindAsync(voucherId)
                ?? throw new Exception("Voucher không tồn tại.");

            var now = DateTime.UtcNow;
            if (now < voucher.NgayBatDau || now > voucher.NgayHetHan)
                throw new Exception("Voucher đã hết hạn hoặc chưa bắt đầu.");

            if (voucher.SoLuong != -1 && voucher.SoLuongDaDung >= voucher.SoLuong)
                throw new Exception("Voucher đã hết lượt nhận.");

            var existed = await _context.VoucherNguoiDungs
                .AnyAsync(vnd => vnd.VoucherId == voucherId && vnd.NguoiDungId == userId);
            if (existed)
                throw new Exception("Bạn đã lấy voucher này rồi.");

            _context.VoucherNguoiDungs.Add(new VoucherNguoiDung
            {
                VoucherId = voucherId,
                NguoiDungId = userId,
                NgayLay = now
            });

            await _context.SaveChangesAsync();
            return voucher.MaCode;
        }

        // ─── Buyer: My Vouchers ───────────────────────────────────────────────
        public async Task<IEnumerable<VoucherDto>> GetMyVouchersAsync(Guid userId)
        {
            var voucherIds = await _context.VoucherNguoiDungs
                .Where(vnd => vnd.NguoiDungId == userId && !vnd.DaDung)
                .Select(vnd => vnd.VoucherId)
                .ToListAsync();

            var vouchers = await _context.Vouchers
                .Where(v => voucherIds.Contains(v.Id))
                .ToListAsync();

            return vouchers.Select(MapToDto);
        }

        // ─── Checkout Validate ────────────────────────────────────────────────
        public async Task<ValidateVoucherResultDto> ValidateVoucherAsync(
            string code, Guid userId, decimal tongTienDonHang, List<Guid> sanPhamDangIds)
        {
            var now = DateTime.UtcNow;
            var voucher = await _context.Vouchers
                .FirstOrDefaultAsync(v => v.MaCode == code.ToUpper().Trim());

            if (voucher == null)
                return new ValidateVoucherResultDto { HopLe = false, LoiMessage = "Mã voucher không tồn tại." };

            if (now < voucher.NgayBatDau || now > voucher.NgayHetHan)
                return new ValidateVoucherResultDto { HopLe = false, LoiMessage = "Voucher đã hết hạn." };

            if (voucher.SoLuong != -1 && voucher.SoLuongDaDung >= voucher.SoLuong)
                return new ValidateVoucherResultDto { HopLe = false, LoiMessage = "Voucher đã hết lượt sử dụng." };

            if (tongTienDonHang < voucher.GiaTriDonHangToiThieu)
                return new ValidateVoucherResultDto
                {
                    HopLe = false,
                    LoiMessage = $"Đơn hàng tối thiểu {voucher.GiaTriDonHangToiThieu:N0}₫ để dùng voucher này."
                };

            // Kiểm tra quyền dùng: voucher CUA_HANG phải đã claim
            if (voucher.LoaiVoucher == LoaiVoucher.CUA_HANG)
            {
                var claimed = await _context.VoucherNguoiDungs
                    .AnyAsync(vnd => vnd.VoucherId == voucher.Id && vnd.NguoiDungId == userId && !vnd.DaDung);
                if (!claimed)
                    return new ValidateVoucherResultDto
                    {
                        HopLe = false,
                        LoiMessage = "Bạn chưa lấy voucher này từ cửa hàng."
                    };

                // Kiểm tra sản phẩm trong đơn có thuộc cửa hàng này không
                if (!string.IsNullOrEmpty(voucher.ApDungChoIds))
                {
                    var productIds = JsonSerializer.Deserialize<List<string>>(voucher.ApDungChoIds) ?? new();
                    var anyMatch = sanPhamDangIds.Any(id => productIds.Contains(id.ToString()));
                    if (!anyMatch)
                        return new ValidateVoucherResultDto
                        {
                            HopLe = false,
                            LoiMessage = "Voucher không áp dụng cho sản phẩm trong đơn hàng này."
                        };
                }
            }

            // Tính số tiền giảm
            decimal soTienGiam = voucher.LoaiGiamGia == LoaiGiamGia.PHAN_TRAM
                ? tongTienDonHang * (voucher.GiaTriGiam / 100m)
                : voucher.GiaTriGiam;

            if (voucher.GiaTriGiamToiDa.HasValue && soTienGiam > voucher.GiaTriGiamToiDa.Value)
                soTienGiam = voucher.GiaTriGiamToiDa.Value;

            return new ValidateVoucherResultDto
            {
                HopLe = true,
                VoucherId = voucher.Id,
                LoaiGiamGia = voucher.LoaiGiamGia.ToString(),
                SoTienGiam = soTienGiam,
                GiaTriDonHangSauGiam = tongTienDonHang - soTienGiam
            };
        }

        // ─── Homepage discount lookup ─────────────────────────────────────────
        public async Task<Dictionary<Guid, decimal>> GetActiveDiscountForProductsAsync(List<Guid> sanPhamDangIds)
        {
            var now = DateTime.UtcNow;
            var result = new Dictionary<Guid, decimal>();

            // Lấy các sản phẩm cùng người bán
            var products = await _context.SanPhamDangs
                .Where(sp => sanPhamDangIds.Contains(sp.Id))
                .Select(sp => new { sp.Id, sp.NguoiBanId, sp.Gia })
                .ToListAsync();

            var sellerIds = products.Select(p => p.NguoiBanId).Distinct().ToList();

            // Lấy voucher cửa hàng đang active của các người bán đó
            var vouchers = await _context.Vouchers
                .Where(v => v.LoaiVoucher == LoaiVoucher.CUA_HANG
                         && v.NguoiBanId.HasValue
                         && sellerIds.Contains(v.NguoiBanId!.Value)
                         && v.NgayBatDau <= now
                         && v.NgayHetHan >= now
                         && (v.SoLuong == -1 || v.SoLuongDaDung < v.SoLuong))
                .ToListAsync();

            foreach (var product in products)
            {
                // Tìm voucher phù hợp nhất (giảm nhiều nhất) cho sản phẩm này
                var applicableVouchers = vouchers
                    .Where(v => v.NguoiBanId == product.NguoiBanId)
                    .Where(v =>
                    {
                        if (string.IsNullOrEmpty(v.ApDungChoIds)) return true; // áp dụng cho tất cả sp của shop
                        var ids = JsonSerializer.Deserialize<List<string>>(v.ApDungChoIds) ?? new();
                        return ids.Contains(product.Id.ToString());
                    })
                    .ToList();

                if (!applicableVouchers.Any()) continue;

                decimal bestDiscount = 0;
                foreach (var v in applicableVouchers)
                {
                    decimal discount = v.LoaiGiamGia == LoaiGiamGia.PHAN_TRAM
                        ? product.Gia * (v.GiaTriGiam / 100m)
                        : v.GiaTriGiam;

                    if (v.GiaTriGiamToiDa.HasValue && discount > v.GiaTriGiamToiDa.Value)
                        discount = v.GiaTriGiamToiDa.Value;

                    if (discount > bestDiscount) bestDiscount = discount;
                }

                if (bestDiscount > 0)
                    result[product.Id] = bestDiscount;
            }

            return result;
        }

        // ─── Helper ───────────────────────────────────────────────────────────
        private static VoucherDto MapToDto(Voucher v)
        {
            var now = DateTime.UtcNow;
            return new VoucherDto
            {
                Id = v.Id,
                MaCode = v.MaCode,
                TenVoucher = v.TenVoucher,
                MoTa = v.MoTa,
                LoaiVoucher = v.LoaiVoucher.ToString(),
                LoaiGiamGia = v.LoaiGiamGia.ToString(),
                GiaTriGiam = v.GiaTriGiam,
                GiaTriGiamToiDa = v.GiaTriGiamToiDa,
                GiaTriDonHangToiThieu = v.GiaTriDonHangToiThieu,
                NgayBatDau = v.NgayBatDau,
                NgayHetHan = v.NgayHetHan,
                SoLuong = v.SoLuong,
                SoLuongDaDung = v.SoLuongDaDung,
                NguoiBanId = v.NguoiBanId,
                TenNguoiBan = v.NguoiBan?.HoTen,
                ApDungChoIds = v.ApDungChoIds,
                ConHieuLuc = now >= v.NgayBatDau && now <= v.NgayHetHan,
                ConSoLuong = v.SoLuong == -1 || v.SoLuongDaDung < v.SoLuong
            };
        }
    }
}
