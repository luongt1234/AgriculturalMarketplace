using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.Auth;
using AgroMarket.Application.DTOs.AuthDTOs;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AgroMarket.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<NguoiDung> _userRepository;
        private readonly IRepository<DanhMuc> _roleRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IDanhMucRepository _danhMucRepository;

        public AuthService(
            IRepository<NguoiDung> userRepository,
            IRepository<DanhMuc> roleRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IConfiguration configuration,
            IDanhMucRepository danhMucRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configuration = configuration;
            _danhMucRepository = danhMucRepository;
        }

        // --- 1. ĐĂNG KÝ ---
        public async Task DangKyAsync(AuthFormDto request)
        {
            try
            {
                // A. Validate Logic
                var existingUsers = await _userRepository.FindAsync(u => u.Email == request.Email);
                if (existingUsers.Any())
                {
                    throw new ArgumentException("Email đã tồn tại trong hệ thống.");
                }

                var vaiTroId = await _danhMucRepository.GetDanhMucByMaGiaTriAsync(request.MaVaiTro);
                if (vaiTroId == null)
                {
                    throw new Exception("Mã vai trò không hợp lệ");
                }
                // B. Map DTO -> Entity
                var user = _mapper.Map<NguoiDung>(request);

                // hash mật khẩu
                var passwordHasher = new PasswordHasher<string>();
                var passwordHash = passwordHasher.HashPassword(null, request.MatKhau);

                // D. Set các giá trị mặc định
                user.Id = Guid.NewGuid();
                user.SoDu = 0;
                user.DiemUyTin = 0;
                user.KichHoat = true;
                user.VaiTroId = vaiTroId.Id;
                user.MatKhauHash = passwordHash;

                // E. Lưu vào DB
                _userRepository.Add(user);
                await _unitOfWork.CommitAsync();
            }
            catch (Exception ex) 
            {
                throw new Exception($"Lỗi {ex.Message}");
            }
        }

        // --- 2. ĐĂNG NHẬP ---
        public async Task<AuthResponseDto> DangNhapAsync(LoginDTO request)
        {
            try
            {
                // A. Tìm user theo username
                var users = await _userRepository.FindAsync(u => u.Email == request.Email);
                var user = users.FirstOrDefault();

                if (user == null)
                {
                    throw new KeyNotFoundException("Tài khoản không tồn tại.");
                }

                // B. Kiểm tra mật khẩu (So sánh pass thô vs pass hash)
                var passwordHasher = new PasswordHasher<string>();
                var passwordResult = passwordHasher.VerifyHashedPassword(null, user.MatKhauHash, request.MatKhau);
                if (passwordResult != PasswordVerificationResult.Success)
                {
                    throw new ArgumentException("Mật khẩu không chính xác.");
                }

                // C. Lấy thông tin Vai Trò (Vì user.VaiTro có thể null do chưa Include)
                var role = await _roleRepository.GetByIdAsync(user.VaiTroId);
                if (role == null)
                    throw new Exception("Lỗi dữ liệu: User không có vai trò hợp lệ.");

                user.VaiTro = role;

                // D. Sinh Token
                var token = GenerateJwtToken(user);

                // E. Map sang DTO trả về
                var response = _mapper.Map<AuthResponseDto>(user);
                response.Token = token; // Gán token thủ công

                return response;
            } 
            catch (Exception ex)
            {
                throw new Exception($"Lỗi {ex.Message}");
            }
        }

        // --- PRIVATE HELPER: SINH JWT ---
        private string GenerateJwtToken(NguoiDung user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                //new Claim(JwtRegisteredClaimNames.Sub, user.TenDangNhap),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                new Claim(ClaimTypes.Role, user.VaiTro.MaGiaTri ?? "GUEST")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["DurationInMinutes"]!)),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}