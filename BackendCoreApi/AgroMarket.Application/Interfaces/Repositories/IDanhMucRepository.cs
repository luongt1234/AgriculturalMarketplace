using AgroMarket.Domain.Entities;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IDanhMucRepository
    {
        Task<IEnumerable<DanhMuc>> GetDanhMucByLoaiAsync(string loai);
    }
}
