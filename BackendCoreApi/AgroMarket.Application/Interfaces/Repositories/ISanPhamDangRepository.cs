using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface ISanPhamDangRepository
    {
        Task<(IEnumerable<AgroMarket.Domain.Entities.SanPhamDang> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize);
        Task<AgroMarket.Domain.Entities.SanPhamDang?> GetByIdAsync(Guid id);
        Task<(IEnumerable<AgroMarket.Domain.Entities.SanPhamDang> Items, int TotalRecords)> GetByUserPagedAsync(Guid userId, int pageNumber, int pageSize);
    }
}
