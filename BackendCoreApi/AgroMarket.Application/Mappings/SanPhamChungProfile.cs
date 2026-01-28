using AgroMarket.Application.DTOs.SanPhamChuDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;

namespace AgroMarket.Application.Mappings
{
    public class SanPhamChungProfile : Profile
    {
        public SanPhamChungProfile()
        {
            CreateMap<SanPhamChung, SanPhamChungDto>().MaxDepth(1);
            CreateMap<SanPhamChungFormDto, SanPhamChung>()
                  .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            //CreateMap<UpdateSanPhamChungCommand, SanPhamChung>();
        }
    }
}
