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
        public DanhMucService(IRepository<DanhMuc> baseRepository, IDanhMucRepository repo, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _baseRepository = baseRepository;
            _repo = repo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DanhMucDto>> GetDanhMucByLoai(string loai)
        {
            var danhMucs = await _repo.GetDanhMucByLoaiAsync(loai);

            var result = _mapper.Map<IEnumerable<DanhMuc>>(danhMucs);

            return result;
        }
    }
}
