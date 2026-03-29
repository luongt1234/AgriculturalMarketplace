using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Repositories
{
    public class DanhMucRepository : BaseRepository<DanhMuc>, IDanhMucRepository
    {
        //private readonly IRepository<DanhMuc> _repository;
        //protected readonly DbSet<DanhMuc> _context;
        public DanhMucRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DanhMuc>> GetDanhMucByLoaiAsync(Guid loaiDanhMucId)
        {
            var result = await _dbSet.Where(x => x.LoaiDanhMucId == loaiDanhMucId).ToListAsync();
            return result;
        }

        public async Task<DanhMuc?> GetDanhMucByMaGiaTriAsync(string maGiaTri)
        {
            var result = await _dbSet.FirstOrDefaultAsync(x => x.MaGiaTri == maGiaTri);
            return result;
        }
    }
}