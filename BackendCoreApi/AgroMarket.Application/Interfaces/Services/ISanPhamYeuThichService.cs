using System;
using System.Collections.Generic;

using System.Threading.Tasks;
using AgroMarket.Application.DTOs.SanPhamYeuThichDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ISanPhamYeuThichService
    {
        Task<IEnumerable<SanPhamYeuThichDto>> LlayDanhSachYeuThichAsync(Guid nguoiDungId);
        Task<bool> ToggleYeuThichAsync(Guid nguoiDungId, Guid sanPhamDangId);
        Task<List<Guid>> LayDanhSachSanPhamIdYeuThichAsync(Guid nguoiDungId);
    }
}
