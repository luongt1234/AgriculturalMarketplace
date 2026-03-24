using AgroMarket.Application.DTOs.DanhMucDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IDanhMucService
    {
        Task<IEnumerable<DanhMucDto>> GetDanhMucByLoai(string loai);
        Task<DanhMucDto> GetDanhMucByMaGiaTriAsync(string MaGiaTri);
    }
}
