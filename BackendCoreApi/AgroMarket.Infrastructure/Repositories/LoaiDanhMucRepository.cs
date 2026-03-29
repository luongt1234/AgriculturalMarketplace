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
    public class LoaiDanhMucRepository : BaseRepository<LoaiDanhMuc>, ILoaiDanhMucRepository
    {
        public LoaiDanhMucRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<LoaiDanhMuc?> GetLoaiDanhMucByMaLoaiAsync(string maLoai)
        {
            var loaiDanhMuc = await _dbSet.FirstOrDefaultAsync(x => x.MaLoaiDanhMuc == maLoai);
            return loaiDanhMuc;
        }
    }
}
