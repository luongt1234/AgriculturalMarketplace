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
        private readonly IBaseService<SanPhamDang> _sevice;
        public SanPhamDangService(IFileStorageService fileStorageService, ISanPhamChungRepository sanPhamChungRepository, IMapper mapper, ISanPhamDangRepository sanPhamDangRepository, IUnitOfWork unitOfWork, ICurrentUserService currentUserService, IBaseService<SanPhamDang> service)
        {
            _fileStorageService = fileStorageService;
            _sanPhamChungRepository = sanPhamChungRepository;
            _mapper = mapper;
            _sanPhamDangRepository = sanPhamDangRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _sevice = service; 
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

                if (!await _sanPhamChungRepository.CheckExistCatagory(request.SanPhamChungId))
                {
                    throw new Exception("Không có sản phẩm chung này.");
                }

                var sanPhamDang = _mapper.Map<SanPhamDang>(request);
                sanPhamDang.Id = Guid.NewGuid();
                sanPhamDang.TrangThai = Domain.Enums.TrangThaiSanPham.ConHang;
                sanPhamDang.NgayDang = DateTime.UtcNow.AddHours(7);
                sanPhamDang.NgayTao = DateTime.UtcNow.AddHours(7);
                sanPhamDang.HinhAnhUrl = hinhAnhPath;
                // Ensure mapping of user id if provided
                if (_currentUserService.UserId != null && _currentUserService.UserId != Guid.Empty)
                {
                    sanPhamDang.NguoiBanId = _currentUserService.UserId.Value;
                }

                await _sevice.CreateAsync(sanPhamDang);

                await _unitOfWork.CommitAsync();
                return _mapper.Map<SanPhamDangDto>(sanPhamDang);
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }

        public async Task<PagedResponse<IEnumerable<SanPhamDangDto>>> GetAllProductsAsync(int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var (items, total) = await _sanPhamDangRepository.GetPagedAsync(pageNumber, pageSize);
                var dtoList = _mapper.Map<IEnumerable<SanPhamDangDto>>(items);
                return new PagedResponse<IEnumerable<SanPhamDangDto>>(dtoList, pageNumber, pageSize, total);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy danh sách sản phẩm: {ex.Message}");
            }
        }

        public async Task<PagedResponse<IEnumerable<SanPhamDangDto>>> GetProductsByUserAsync(Guid userId, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var (items, total) = await _sanPhamDangRepository.GetByUserPagedAsync(userId, pageNumber, pageSize);
                var dtoList = _mapper.Map<IEnumerable<SanPhamDangDto>>(items);
                return new PagedResponse<IEnumerable<SanPhamDangDto>>(dtoList, pageNumber, pageSize, total);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy danh sách sản phẩm người dùng: {ex.Message}");
            }
        }

        public async Task<SanPhamDangDto?> GetByIdAsync(Guid id)
        {
            try
            {
                var entity = await _sanPhamDangRepository.GetByIdAsync(id);
                if (entity == null) return null;
                return _mapper.Map<SanPhamDangDto>(entity);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy thông tin sản phẩm: {ex.Message}");
            }
        }
    }
}