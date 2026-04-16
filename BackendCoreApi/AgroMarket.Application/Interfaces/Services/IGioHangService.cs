using AgroMarket.Application.DTOs.GioHangDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IGioHangService
    {
        Task<GioHangDto> GetCartAsync(Guid nguoiDungId);
        Task<GioHangDto> AddOrUpdateItemAsync(Guid nguoiDungId, ThemVaoGioHangDto dto);
        Task<GioHangDto> UpdateItemQuantityAsync(Guid nguoiDungId, Guid chiTietId, int soLuong);
        Task<GioHangDto> RemoveItemAsync(Guid nguoiDungId, Guid chiTietId);
        Task ClearCartAsync(Guid nguoiDungId);
    }
}
