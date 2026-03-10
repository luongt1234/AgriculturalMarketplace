using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Wrappers;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Services
{
    public class SanPhamDangService : ISanPhamDangService
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ISanPhamChungRepository _sanPhamChungRepository;
        private readonly IMapper _mapper;
        private readonly ISanPhamDangRepository _sanPhamDangRepository;
        protected readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        public SanPhamDangService(IFileStorageService fileStorageService, ISanPhamChungRepository sanPhamChungRepository, IMapper mapper, ISanPhamDangRepository sanPhamDangRepository, IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
        {
            _fileStorageService = fileStorageService;
            _sanPhamChungRepository = sanPhamChungRepository;
            _mapper = mapper;
            _sanPhamDangRepository = sanPhamDangRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }
        public async Task<SanPhamDangDto> CreateAsync(SanPhamDangFormDto request, IFormFile? hinhAnh)
        {
            try
            {
                string hinhAnhPath = "";
                try
                {
                    // Lưu ảnh vào thư mục 'wwwroot/uploads/products'
                    hinhAnhPath = await _fileStorageService.SaveFileAsync(hinhAnh, "products");
                }
                catch (Exception ex)
                {
                    throw new ApplicationException($"Lưu hình ảnh lỗi: {ex.Message}");
                }

                if (!await _sanPhamChungRepository.CheckExistCatagory(request.spc_id))
                {
                    throw new Exception("Không có sản phẩm chung này.");
                }

                var sanPhamDang = _mapper.Map<SanPhamDang>(request);
                sanPhamDang.Id = Guid.NewGuid();
                sanPhamDang.TrangThai = Domain.Enums.TrangThaiSanPham.ConHang;
                sanPhamDang.NgayDang = DateTime.UtcNow.AddHours(7);
                sanPhamDang.NgayTao = DateTime.UtcNow.AddHours(7);
                sanPhamDang.HinhAnhUrl = hinhAnhPath;

                await _unitOfWork.CommitAsync();
                return _mapper.Map<SanPhamDangDto>(sanPhamDang);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi tạo sản phẩm đăng: {ex.Message}");
            }
        }

        //public Task<PaginatedResult<IEnumerable<SanPhamDangDto>>> GetProductByBuyerAsync(Guid buyerId)
        //{
        //    try
        //    {
        //        var userId = _currentUserService.UserId;
        //        if (userId == null)
        //        {
        //            throw new Exception("Người dùng không hợp lệ");
        //        }


        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"Lỗi khi lây danh sách sản phẩm: {ex.Message}");
        //    }
        //}
    }
}