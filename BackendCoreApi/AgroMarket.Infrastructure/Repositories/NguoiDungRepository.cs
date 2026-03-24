using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgroMarket.Infrastructure.Repositories
{
    public class NguoiDungRepository : BaseRepository<NguoiDung>, INguoiDungRepository
    {
        public NguoiDungRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Lấy danh sách người dùng theo phân trang.
        /// pageIndex được hiểu là pageSize, pageNumber là chỉ số trang (1-based).
        /// Trả về tuple gồm danh sách người dùng và tổng số bản ghi.
        /// </summary>
        public async Task<(IEnumerable<NguoiDung> Data, int TotalRecords)> GetAllPagedAsync(int pageSize, int pageNumber)
        {
            // Tổng số bản ghi (không bao gồm soft-deleted)
            var total = await _dbSet.Where(x => !x.IsDeleted).CountAsync();

            var items = await _dbSet
                .Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<(IEnumerable<NguoiDung> Data, int TotalRecords)> GetAllBuyerPagedAsync(int pageSize, int pageNumber, Guid vaiTroId)
        {
            var total = await _dbSet.Where(x => !x.IsDeleted && x.VaiTroId == vaiTroId).CountAsync();

            var items = await _dbSet
                .Where(x => !x.IsDeleted && x.VaiTroId == vaiTroId)
                .OrderByDescending(x => x.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }
    }
}
