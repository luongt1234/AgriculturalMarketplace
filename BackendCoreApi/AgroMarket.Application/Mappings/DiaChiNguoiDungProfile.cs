using AgroMarket.Application.DTOs.DiaChiNguoiDungDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Mappings
{
    public class DiaChiNguoiDungProfile : Profile
    {
        public DiaChiNguoiDungProfile()
        {
            CreateMap<DiaChiNguoiDungFormDto, DiaChiNguoiDung>();
            CreateMap<DiaChiNguoiDung, DiaChiNguoiDungDto>();
        }
    }
}
