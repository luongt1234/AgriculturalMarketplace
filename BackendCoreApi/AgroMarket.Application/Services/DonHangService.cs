using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Wrappers;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.Services
{
    public class DonHangService : IDonHangService
    {
        private readonly IDonHangRepository _donHangRepository;

        public DonHangService(IDonHangRepository donHangRepository)
        {
            _donHangRepository = donHangRepository;
        }

        public async Task<PagedResponse<IEnumerable<DonHangDto>>> GetMyOrdersAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null)
        {
            var (items, total) = await _donHangRepository.GetByNguoiMuaPagedAsync(
                nguoiMuaId, pageNumber, pageSize, trangThai);

            return new PagedResponse<IEnumerable<DonHangDto>>(items, pageNumber, pageSize, total);
        }
    }
}
