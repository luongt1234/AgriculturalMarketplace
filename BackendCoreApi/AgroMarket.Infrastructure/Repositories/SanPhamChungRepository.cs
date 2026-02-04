using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Infrastructure.Repositories
{
    public class SanPhamChungRepository : ISanPhamChungRepository
    {
        private readonly DbSet<SanPhamChung> _repo;
        public SanPhamChungRepository(DbSet<SanPhamChung> repo)
        {
            _repo = repo;
        }
        public IEnumerable<SanPhamChung> GetSanPhamChungsByParentId(Guid parentId)
        {
            return _repo.Where(spc => spc.ChaId == parentId);
        }
        public async Task<List<SanPhamChungDto>> GetParentsWithChildAsync(int pageSize, int pageNumber)
        {
            var parentQuery = _repo
                .Where(x => x.ChaId == null)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            var parentIds = parentQuery.Select(x => x.Id);

            var childsQuery = _repo
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
                        sanPhamCons = children
                            .Select(c => new SanPhamChungDto
                            {
                                id = c.Id,
                                TenSanPham = c.TenSanPham
                            }).ToList()
                    })
                .ToListAsync();

            return result;
        }

    }
}
