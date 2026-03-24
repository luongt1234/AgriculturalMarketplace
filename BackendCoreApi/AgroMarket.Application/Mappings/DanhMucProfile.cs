using AgroMarket.Application.DTOs.DanhMucDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Mappings
{
    public class DanhMucProfile : Profile
    {
        public DanhMucProfile()
        {
            CreateMap<DanhMuc, DanhMucDto>();
            CreateMap<DanhMucFormDto, DanhMuc>();
        }
    }
}
