using AgroMarket.Domain.Entities;
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
        // Lấy phân trang kèm các relation cần thiết (SanPhamChung, NguoiBan, ChatLuong, DonVi, Loai)
        Task<(IEnumerable<AgroMarket.Domain.Entities.SanPhamDang> Items, int TotalRecords)> GetPagedWithIncludesAsync(int pageNumber, int pageSize, string? keyword = null, Guid? sanPhamChungId = null);
        Task<IEnumerable<AgroMarket.Domain.Entities.SanPhamDang>> SearchSuggestionsAsync(string keyword, int limit);
        // Lấy chi tiết 1 SanPhamDang kèm các relation để hiển thị
        Task<AgroMarket.Domain.Entities.SanPhamDang?> GetByIdWithIncludesAsync(Guid id);
        Task<IEnumerable<SanPhamDang>> GetTopActiveProductsAsync(int count);
    }
}
