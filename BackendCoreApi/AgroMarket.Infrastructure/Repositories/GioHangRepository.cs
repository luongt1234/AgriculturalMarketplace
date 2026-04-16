using AgroMarket.Application.DTOs.GioHangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Repositories
{
    public class GioHangRepository : IGioHangRepository
    {
        private readonly AppDbContext _context;

        public GioHangRepository(AppDbContext context)
        {
            _context = context;
        }

        // ── Helpers ──────────────────────────────────────────────────────────────

        private async Task<GioHang> GetOrCreateEntityAsync(Guid nguoiDungId)
        {
            var cart = await _context.GioHangs
                .Include(g => g.ChiTiet)
                    .ThenInclude(ct => ct.SanPhamDang)
                        .ThenInclude(sp => sp.NguoiBan)
                .FirstOrDefaultAsync(g => g.NguoiDungId == nguoiDungId);

            if (cart == null)
            {
                cart = new GioHang { NguoiDungId = nguoiDungId };
                _context.GioHangs.Add(cart);
                await _context.SaveChangesAsync();
            }
            return cart;
        }

        private static GioHangDto MapToDto(GioHang cart) => new GioHangDto
        {
            Id = cart.Id,
            NguoiDungId = cart.NguoiDungId,
            ChiTiet = cart.ChiTiet.Select(ct => new ChiTietGioHangDto
            {
                Id = ct.Id,
                SanPhamDangId = ct.SanPhamDangId,
                TenSanPham = ct.SanPhamDang.TenHienThi,
                HinhAnhUrl = ct.SanPhamDang.HinhAnhUrl,
                Gia = ct.SanPhamDang.Gia,
                SoLuong = ct.SoLuong,
                NguoiBanId = ct.SanPhamDang.NguoiBanId,
                TenNguoiBan = ct.SanPhamDang.NguoiBan.HoTen
            }).ToList()
        };

        // ── Public methods ────────────────────────────────────────────────────────

        public async Task<GioHangDto> GetOrCreateCartAsync(Guid nguoiDungId)
        {
            var cart = await GetOrCreateEntityAsync(nguoiDungId);
            return MapToDto(cart);
        }

        public async Task<GioHangDto> AddOrUpdateItemAsync(Guid nguoiDungId, Guid sanPhamDangId, int soLuong)
        {
            var cart = await GetOrCreateEntityAsync(nguoiDungId);

            var existing = cart.ChiTiet.FirstOrDefault(ct => ct.SanPhamDangId == sanPhamDangId);
            if (existing != null)
            {
                existing.SoLuong += soLuong;
            }
            else
            {
                var item = new ChiTietGioHang
                {
                    GioHangId = cart.Id,
                    SanPhamDangId = sanPhamDangId,
                    SoLuong = soLuong
                };
                cart.ChiTiet.Add(item);
                _context.ChiTietGioHangs.Add(item);
            }

            await _context.SaveChangesAsync();

            // Reload to get full navigation data
            return await GetOrCreateCartAsync(nguoiDungId);
        }

        public async Task<GioHangDto> UpdateItemQuantityAsync(Guid nguoiDungId, Guid chiTietId, int soLuong)
        {
            var cart = await GetOrCreateEntityAsync(nguoiDungId);
            var item = cart.ChiTiet.FirstOrDefault(ct => ct.Id == chiTietId)
                ?? throw new KeyNotFoundException("Không tìm thấy mục trong giỏ hàng");

            if (soLuong <= 0)
            {
                _context.ChiTietGioHangs.Remove(item);
            }
            else
            {
                item.SoLuong = soLuong;
            }

            await _context.SaveChangesAsync();
            return await GetOrCreateCartAsync(nguoiDungId);
        }

        public async Task<GioHangDto> RemoveItemAsync(Guid nguoiDungId, Guid chiTietId)
        {
            var cart = await GetOrCreateEntityAsync(nguoiDungId);
            var item = cart.ChiTiet.FirstOrDefault(ct => ct.Id == chiTietId)
                ?? throw new KeyNotFoundException("Không tìm thấy mục trong giỏ hàng");

            _context.ChiTietGioHangs.Remove(item);
            await _context.SaveChangesAsync();
            return await GetOrCreateCartAsync(nguoiDungId);
        }

        public async Task ClearCartAsync(Guid nguoiDungId)
        {
            var cart = await GetOrCreateEntityAsync(nguoiDungId);
            _context.ChiTietGioHangs.RemoveRange(cart.ChiTiet);
            await _context.SaveChangesAsync();
        }
    }
}
