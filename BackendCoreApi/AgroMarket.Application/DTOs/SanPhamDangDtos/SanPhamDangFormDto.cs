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
        [FromForm(Name = "spc_id")]
        public Guid spc_id { get; set; }

        [FromForm(Name = "gia")]
        public decimal Gia { get; set; }

        [FromForm(Name = "so_luong")]
        public int so_luong { get; set; }

        [FromForm(Name = "tinh_trang")]
        public string tinh_trang { get; set; } = "con_hang";

        [FromForm(Name = "hinh_anh")]
        public IFormFile hinh_anh { get; set; }

        [FromForm(Name = "mo_ta")]
        public string? mo_ta { get; set; }
        [FromForm(Name = "ten_san_pham")]
        public string ten_san_pham { get; set; }
        public Guid user_id { get; set; }
        public Guid chat_luong_id { get; set; }

        public DateTime ngay_dang { get; set; } = DateTime.UtcNow.AddHours(7);
        public DateTime ngay_tao { get; set; } = DateTime.UtcNow.AddHours(7);
    }
}
