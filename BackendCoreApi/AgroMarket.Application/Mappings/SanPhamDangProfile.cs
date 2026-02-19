using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Mappings
{
    public class SanPhamDangProfile : Profile
    {
        public SanPhamDangProfile()
        {
            CreateMap<SanPhamDang, SanPhamDangDto>();
            CreateMap<SanPhamDangFormDto, SanPhamDang>();
        }
    }
}
