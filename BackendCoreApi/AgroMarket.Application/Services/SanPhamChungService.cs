using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Application.Services
{
    public class SanPhamChungService : ISanPhamChungService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<SanPhamChung> _baseRepository;
        private readonly IMapper _mapper;
        private readonly ISanPhamChungRepository _sanPhamChungRepository;
        public SanPhamChungService(IUnitOfWork unitOfWork, IRepository<SanPhamChung> baseRepository, IMapper mapper, ISanPhamChungRepository sanPhamChungRepository)
        {
            _unitOfWork = unitOfWork;
            _baseRepository = baseRepository;
            _mapper = mapper;
            _sanPhamChungRepository = sanPhamChungRepository;
        }

        public async Task<IEnumerable<SanPhamChungDto>> GetAllWithDetailsAsync(int pageSize = 10, int pageNumber = 1)
        {
            try
            {
                var sanPhamChungDtos = await _baseRepository.Query()
                    .Where(x => x.ChaId == null)
                    .ProjectTo<SanPhamChungDto>(_mapper.ConfigurationProvider)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return sanPhamChungDtos;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<SanPhamChungDto>> GetTree()
        {
            try
            {
                var sanPhamChungs = await _baseRepository.Query()
                    .ToListAsync();

                var sanPhamChungDtos = _mapper.Map<List<SanPhamChungDto>>(sanPhamChungs);

                var result = new List<SanPhamChungDto>();
                var parent = sanPhamChungDtos.Where(x => x.ChaId == null).ToList();
                BuildTree(sanPhamChungDtos, parent, result);

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private void BuildTree(List<SanPhamChungDto> sanPhamChungDtos, List<SanPhamChungDto> parent, List<SanPhamChungDto> tree)
        {
            if (parent == null || parent.Count == 0)
            {
                tree.AddRange(sanPhamChungDtos.Where(x => x.ChaId == null));
            }
            else
            {
                foreach (var item in parent)
                {
                    tree.Add(item);

                    var children = sanPhamChungDtos.Where(x => x.ChaId == item.id).ToList();
                    if (children.Count > 0)
                    {
                        item.children = children;
                        BuildTree(sanPhamChungDtos, children, tree);
                    }
                }
            }

        }
    }
}