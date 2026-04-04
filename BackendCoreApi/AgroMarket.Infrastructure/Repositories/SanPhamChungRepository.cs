using AgroMarket.Application.DTOs.SanPhamChuDtos;
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
    public class SanPhamChungRepository : BaseRepository<SanPhamChung>, ISanPhamChungRepository
    {
        public SanPhamChungRepository(AppDbContext context) : base(context)
        {
        }
        public IEnumerable<SanPhamChung> GetSanPhamChungsByParentId(Guid parentId)
        {
            return _dbSet.Where(spc => spc.ChaId == parentId);
        }
        public async Task<List<SanPhamChungDto>> GetParentsWithChildAsync(int pageSize, int pageNumber)
        {
            var parentQuery = _dbSet
                .Where(x => x.ChaId == null)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            var parentIds = parentQuery.Select(x => x.Id);

            var childsQuery = _dbSet
                .Where(x => parentIds.Contains(x.ChaId!.Value));

            var result = await parentQuery
                .GroupJoin(
                    childsQuery,
                    parent => parent.Id,
                    child => child.ChaId,
                    (parent, children) => new SanPhamChungDto
                    {
                        id = parent.Id,
                        TenSanPham = parent.TenSanPham,
                        children = children
                            .Select(c => new SanPhamChungDto
                            {
                                id = c.Id,
                                TenSanPham = c.TenSanPham
                            }).ToList()
                    })
                .ToListAsync();

            return result;
        }

        public async Task<bool> CheckExistCatagory(Guid catagoryId)
        {
            return await _dbSet.AnyAsync(x => x.Id == catagoryId);
        }
    }
}
