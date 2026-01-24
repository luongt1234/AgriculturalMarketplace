using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class DanhGia : BaseEntity
    {
        public Guid DonHangId { get; set; } // don_hang_id
        [ForeignKey("DonHangId")]
        public virtual DonHang DonHang { get; set; } = null!;

        public Guid NguoiDanhGiaId { get; set; } // nguoi_danh_gia_id
        [ForeignKey("NguoiDanhGiaId")]
        public virtual NguoiDung NguoiDanhGia { get; set; } = null!;

        public Guid NguoiBiDanhGiaId { get; set; } // nguoi_bi_danh_gia_id
        [ForeignKey("NguoiBiDanhGiaId")]
        public virtual NguoiDung NguoiBiDanhGia { get; set; } = null!;

        public int SoSao { get; set; } // so_sao
        public string? BinhLuan { get; set; } // binh_luan
    }
}