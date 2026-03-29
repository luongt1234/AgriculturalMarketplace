using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.DanhMucDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;

namespace AgroMarket.Application.Services
{
    public class DanhMucService : IDanhMucService
    {
        private readonly IRepository<DanhMuc> _baseRepository;
        private readonly IDanhMucRepository _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILoaiDanhMucRepository _loaiDanhMucRepo;
        public DanhMucService(IRepository<DanhMuc> baseRepository, IDanhMucRepository repo, IUnitOfWork unitOfWork, IMapper mapper, ILoaiDanhMucRepository loaiDanhMucRepo)
        {
            _baseRepository = baseRepository;
            _repo = repo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _loaiDanhMucRepo = loaiDanhMucRepo;
        }

        public async Task<IEnumerable<DanhMucDto>> GetDanhMucByLoai(string loai)
        {
            try
            {
                var loaiDanhMuc = await _loaiDanhMucRepo.GetLoaiDanhMucByMaLoaiAsync(loai);

                if (loaiDanhMuc == null)
                {
                    throw new Exception("Không có loại danh mục này");
                }
                var danhMucs = await _repo.GetDanhMucByLoaiAsync(loaiDanhMuc.Id);

                var result = _mapper.Map<IEnumerable<DanhMucDto>>(danhMucs);

                return result;
            }
            catch (Exception ex) 
            { 
                throw new Exception($"Lỗi: {ex.Message}");
            }
        }

        public async Task<DanhMucDto> GetDanhMucByMaGiaTriAsync(string MaGiaTri)
        {
            var danhMuc = await _repo.GetDanhMucByMaGiaTriAsync(MaGiaTri);

            var result = _mapper.Map<DanhMucDto>(danhMuc);
            return result;
        }
    }
}
