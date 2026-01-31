using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Repositories
{
    public class DanhMucRepository : IDanhMucRepository
    {
        //private readonly IRepository<DanhMuc> _repository;
        protected readonly DbSet<DanhMuc> _context;
        public DanhMucRepository(DbSet<DanhMuc> context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DanhMuc>> GetDanhMucByLoaiAsync(string loai)
        {
            var result = await _context.Where(x => x.Loai == loai).ToListAsync();
            return result;
        }
    }
}