using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class ViGiaoDich : BaseEntity
    {
        public Guid NguoiDungId { get; set; } // user_id
        [ForeignKey("NguoiDungId")]
        public virtual NguoiDung NguoiDung { get; set; } = null!;

        public decimal SoTien { get; set; } // so_tien
        public LoaiGiaoDichVi LoaiGiaoDich { get; set; } // loai_giao_dich
        public string MoTa { get; set; } = null!; // mo_ta
        public string TrangThai { get; set; } = null!; // trang_thai (Hoặc dùng Enum)
    }
}