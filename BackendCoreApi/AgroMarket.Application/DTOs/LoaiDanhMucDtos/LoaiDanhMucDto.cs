using AgroMarket.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.DTOs.LoaiDanhMucDtos
{
    public class LoaiDanhMucDto
    {
        public Guid Id { get; set; }
        public string? MaLoaiDanhMuc { get; set; }
        public string? TenLoaiDanhMuc { get; set; } = "";
    }
}
