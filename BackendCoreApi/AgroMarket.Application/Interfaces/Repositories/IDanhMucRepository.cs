using AgroMarket.Domain.Entities;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IDanhMucRepository
    {
        Task<IEnumerable<DanhMuc>> GetDanhMucByLoaiAsync(Guid loaiDanhMucId);
        Task<DanhMuc?> GetDanhMucByMaGiaTriAsync(string maGiaTri);
    }
}
