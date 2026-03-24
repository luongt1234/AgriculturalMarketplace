using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Wrappers;
using AgroMarket.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Services
{
    public class NguoiDungService : INguoiDungService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<NguoiDung> _baseRepository;
        private readonly IMapper _mapper;
        private readonly INguoiDungRepository _nguoiDungRepository;
        private readonly IDanhMucRepository _danhMucRepository;

        public NguoiDungService(IUnitOfWork unitOfWork, IRepository<NguoiDung> baseRepository, IMapper mapper, INguoiDungRepository nguoiDungRepository, IDanhMucRepository danhMucRepository)
        {
            _unitOfWork = unitOfWork;
            _baseRepository = baseRepository;
            _mapper = mapper;
            _nguoiDungRepository = nguoiDungRepository;
            _danhMucRepository = danhMucRepository;
        }

        public async Task<PagedResponse<IEnumerable<NguoiDungDto>>> GetAllByMaAsync(int pageSize, int pageNumber, string ma)
        {
            try
            {
                var danhMuc = await _danhMucRepository.GetDanhMucByMaGiaTriAsync(ma);
                if (danhMuc == null)
                {
                    throw new Exception("Không có vai trò nông dân");
                }

                var (items, total) = await _nguoiDungRepository.GetAllBuyerPagedAsync(pageSize, pageNumber, danhMuc.Id);

                var dtoList = _mapper.Map<IEnumerable<NguoiDungDto>>(items);

                var response = new PagedResponse<IEnumerable<NguoiDungDto>>(dtoList, pageNumber, pageSize, total);

                return response;
            }
            catch(Exception ex)
            {
                throw new Exception("Lỗi Lấy dữ liệu người dùng");
            }
        }
    }
}
