using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Mappings
{
    public class NguoiDungProfile : Profile
    {
        public NguoiDungProfile()
        {
            CreateMap<NguoiDung, NguoiDungDto>();
            CreateMap<NguoiDungFormDto, NguoiDung>();
        }
    }
}
