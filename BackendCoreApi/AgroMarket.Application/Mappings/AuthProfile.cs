using AgroMarket.Application.DTOs.Auth;
using AgroMarket.Domain.Entities;
using AutoMapper;

namespace AgroMarket.Application.Mappings
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<AuthFormDto, NguoiDung>()
                .ForMember(src => src.HoTen, otp => otp.MapFrom(x => x.HoVaTen));

            CreateMap<NguoiDung, AuthResponseDto>()
                .ForMember(src => src.MaVaiTro, otp => otp.MapFrom(x => x.VaiTro.MaGiaTri));
        }
    }
}
