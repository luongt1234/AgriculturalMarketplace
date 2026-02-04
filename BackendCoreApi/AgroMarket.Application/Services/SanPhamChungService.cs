using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
