using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.DTOs.SanPhamDangDtos;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface ISanPhamDangService
    {
        Task<SanPhamDangDto> CreateAsync(SanPhamDangFormDto request, IFormFile? hinhAnh);
    }
}
