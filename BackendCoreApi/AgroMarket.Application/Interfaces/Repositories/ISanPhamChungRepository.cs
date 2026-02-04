using AgroMarket.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface ISanPhamChungRepository
    {
        IEnumerable<SanPhamChung> GetSanPhamChungsByParentId(Guid parentId);
    }
}
