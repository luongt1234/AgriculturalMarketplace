using AgroMarket.Application.DTOs.CaiDatGiaoDien;

namespace AgroMarket.Application.Interfaces
{
    public interface ICaiDatGiaoDienService
    {
        Task<CaiDatGiaoDienDto> GetSettingsAsync();
        Task<CaiDatGiaoDienDto> UpdateSettingsAsync(UpdateCaiDatGiaoDienDto dto);
    }
}
