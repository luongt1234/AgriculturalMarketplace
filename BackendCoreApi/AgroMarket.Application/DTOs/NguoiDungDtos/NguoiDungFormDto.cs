using System;
using System.ComponentModel.DataAnnotations;

namespace AgroMarket.Application.DTOs.NguoiDungDtos
{
    public class NguoiDungFormDto
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên đăng nhập phải từ 3 đến 50 ký tự.")]
        public string TenDangNhap { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string MatKhau { get; set; } = null!; // Nhận mật khẩu thô từ FE, Backend sẽ tự băm (Hash) thành MatKhauHash

        [Required(ErrorMessage = "Họ và tên không được để trống.")]
        [StringLength(100, ErrorMessage = "Họ tên không vượt quá 100 ký tự.")]
        public string HoTen { get; set; } = null!;

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
        [StringLength(100)]
        public string Email { get; set; } = null!;

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [StringLength(15)]
        public string? SoDienThoai { get; set; } // Cho phép null (optional)

        public string? DiaChi { get; set; } // Cho phép null (optional)

        [Required(ErrorMessage = "Vui lòng chọn vai trò cho người dùng.")]
        public Guid VaiTroId { get; set; } // Ánh xạ tới ID của bảng danh_muc (Nông dân, Thương lái, Admin) [cite: 52]

        // Bạn có thể thêm trường KichHoat nếu form cho phép set trạng thái ngay khi tạo
        public bool KichHoat { get; set; } = true;
    }
}