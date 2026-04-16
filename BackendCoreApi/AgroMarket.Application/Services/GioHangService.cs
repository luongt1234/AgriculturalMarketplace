using AgroMarket.Application.DTOs.GioHangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;

namespace AgroMarket.Application.Services
{
    public class GioHangService : IGioHangService
    {
        private readonly IGioHangRepository _repo;

        public GioHangService(IGioHangRepository repo)
        {
            _repo = repo;
        }

        public Task<GioHangDto> GetCartAsync(Guid nguoiDungId)
            => _repo.GetOrCreateCartAsync(nguoiDungId);

        public Task<GioHangDto> AddOrUpdateItemAsync(Guid nguoiDungId, ThemVaoGioHangDto dto)
            => _repo.AddOrUpdateItemAsync(nguoiDungId, dto.SanPhamDangId, dto.SoLuong);

        public Task<GioHangDto> UpdateItemQuantityAsync(Guid nguoiDungId, Guid chiTietId, int soLuong)
            => _repo.UpdateItemQuantityAsync(nguoiDungId, chiTietId, soLuong);

        public Task<GioHangDto> RemoveItemAsync(Guid nguoiDungId, Guid chiTietId)
            => _repo.RemoveItemAsync(nguoiDungId, chiTietId);

        public Task ClearCartAsync(Guid nguoiDungId)
            => _repo.ClearCartAsync(nguoiDungId);
    }
}
