using AgroMarket.Application.DTOs.LoaiDanhMucDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Mappings
{
    public class LoaiDanhMucProfile : Profile
    {
        public LoaiDanhMucProfile()
        {
            CreateMap<LoaiDanhMuc, LoaiDanhMucDto>();
            CreateMap<LoaiDanhMucFormDto, LoaiDanhMuc>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
