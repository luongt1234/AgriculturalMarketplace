using AgroMarket.Application.DTOs.Auth;
using AgroMarket.Application.DTOs.AuthDTOs;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthFormDto registerDto)
        {
            await _authService.DangKyAsync(registerDto);

            return CreatedResult<object>(null, "Đăng ký tài khoản thành công");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var result = await _authService.DangNhapAsync(loginDto);

            return Success(result, "Đăng nhập thành công");
        }
    }
}