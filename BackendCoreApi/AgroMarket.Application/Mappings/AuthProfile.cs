using AgroMarket.Application.DTOs.Auth;
using AgroMarket.Domain.Entities;
using AutoMapper;

namespace AgroMarket.Application.Mappings
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<AuthFormDto, NguoiDung>();

            CreateMap<NguoiDung, AuthResponseDto>();
        }
    }
}
