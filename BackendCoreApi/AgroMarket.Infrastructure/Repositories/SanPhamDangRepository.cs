using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Infrastructure.Repositories
{
    public class SanPhamDangRepository : BaseRepository<SanPhamDang>, ISanPhamDangRepository
    {
        public SanPhamDangRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<SanPhamDang> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize)
        {
            var query = _dbSet.Where(x => !x.IsDeleted);
            var total = await query.CountAsync();
            var items = await query.OrderByDescending(x => x.NgayDang)
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();
            return (items, total);
        }

        public async Task<SanPhamDang?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        }

        public async Task<(IEnumerable<SanPhamDang> Items, int TotalRecords)> GetByUserPagedAsync(Guid userId, int pageNumber, int pageSize)
        {
            // 1. Base query chỉ chứa điều kiện lọc, dùng chung cho cả đếm và lấy dữ liệu
            var baseQuery = _dbSet.Where(x => !x.IsDeleted && x.NguoiBanId == userId).AsNoTracking();

            // 2. Thực hiện đếm tổng số lượng
            var total = await baseQuery.CountAsync();

            if (total == 0)
            {
                return (new List<SanPhamDang>(), 0);
            }

            // 3. Query lấy dữ liệu chi tiết
            var items = await baseQuery
                .Include(x => x.SanPhamChung)
                    .ThenInclude(spc => spc.DonVi)
                .Include(x => x.ChatLuong)
                .OrderByDescending(x => x.NgayDang)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }
    }
}

