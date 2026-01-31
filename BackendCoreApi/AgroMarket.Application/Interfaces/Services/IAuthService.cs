using AgroMarket.Application.DTOs.Auth;
using AgroMarket.Application.DTOs.AuthDTOs;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task DangKyAsync(AuthFormDto dto);
        Task<AuthResponseDto> DangNhapAsync(LoginDTO dto);
    }
}