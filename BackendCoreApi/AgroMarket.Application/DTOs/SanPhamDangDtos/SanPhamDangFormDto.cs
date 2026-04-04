using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.DTOs.SanPhamDangDtos
{
    public class SanPhamDangFormDto
    {
        [FromForm(Name = "tenHienThi")]
        public string TenHienThi { get; set; } = null!; // tenHienThi: thay cho ten_san_pham

        [FromForm(Name = "sanPhamChungId")]
        public Guid SanPhamChungId { get; set; } // sanPhamChungId: thay cho spc_id

        [FromForm(Name = "chatLuongId")]
        public Guid? ChatLuongId { get; set; } // optional

        [FromForm(Name = "gia")]
        public decimal Gia { get; set; }

        [FromForm(Name = "soLuong")]
        public int SoLuong { get; set; }

        [FromForm(Name = "moTaChiTiet")]
        public string? MoTaChiTiet { get; set; }

        [FromForm(Name = "trangThai")]
        public string? TrangThai { get; set; } = "con_hang";

        [FromForm(Name = "hinhAnh")]
        public IFormFile? HinhAnh { get; set; }

        // Thông tin thêm
        public Guid? UserId { get; set; }

        public DateTime NgayDang { get; set; } = DateTime.UtcNow.AddHours(7);
        public DateTime NgayTao { get; set; } = DateTime.UtcNow.AddHours(7);
    }
}
