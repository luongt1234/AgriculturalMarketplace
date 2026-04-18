using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgroMarket.Application.DTOs.SanPhamYeuThichDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Services
{
    public class SanPhamYeuThichService : ISanPhamYeuThichService
    {
        private readonly AppDbContext _context;

        public SanPhamYeuThichService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SanPhamYeuThichDto>> LlayDanhSachYeuThichAsync(Guid nguoiDungId)
        {
            var query = _context.SanPhamYeuThiches
                .Include(yt => yt.SanPhamDang)
                .ThenInclude(sp => sp.NguoiBan)
                .Where(yt => yt.NguoiDungId == nguoiDungId)
                .Select(yt => new SanPhamYeuThichDto
                {
                    SanPhamYeuThichId = yt.Id,
                    SanPhamDangId = yt.SanPhamDangId,
                    TenHienThi = yt.SanPhamDang.TenHienThi ?? "",
                    Gia = yt.SanPhamDang.Gia,
                    HinhAnhUrl = yt.SanPhamDang.HinhAnhUrl,
                    NguoiBanId = yt.SanPhamDang.NguoiBanId,
                    TenCuaHang = yt.SanPhamDang.NguoiBan.HoTen, // Assuming HoTen is used as shop name or fallback
                    NgayYeuThich = yt.NgayTao
                });

            return await query.ToListAsync();
        }

        public async Task<bool> ToggleYeuThichAsync(Guid nguoiDungId, Guid sanPhamDangId)
        {
            var existing = await _context.SanPhamYeuThiches
                .FirstOrDefaultAsync(yt => yt.NguoiDungId == nguoiDungId && yt.SanPhamDangId == sanPhamDangId);

            if (existing != null)
            {
                // Un-favorite
                _context.SanPhamYeuThiches.Remove(existing);
                await _context.SaveChangesAsync();
                return false; // Result is NOT favorite anymore
            }
            else
            {
                // Favorite
                var newYt = new SanPhamYeuThich
                {
                    NguoiDungId = nguoiDungId,
                    SanPhamDangId = sanPhamDangId
                };
                _context.SanPhamYeuThiches.Add(newYt);
                await _context.SaveChangesAsync();
                return true; // Result IS favorite
            }
        }

        public async Task<List<Guid>> LayDanhSachSanPhamIdYeuThichAsync(Guid nguoiDungId)
        {
            return await _context.SanPhamYeuThiches
                .Where(yt => yt.NguoiDungId == nguoiDungId)
                .Select(yt => yt.SanPhamDangId)
                .ToListAsync();
        }
    }
}
