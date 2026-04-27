using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public enum LoaiVoucher { HE_THONG, CUA_HANG }
    public enum LoaiGiamGia { PHAN_TRAM, SO_TIEN_CO_DINH }

    public class Voucher : BaseEntity
    {
        public string MaCode { get; set; } = string.Empty;         // Code nhập khi checkout
        public string TenVoucher { get; set; } = string.Empty;
        public string? MoTa { get; set; }

        public LoaiVoucher LoaiVoucher { get; set; }               // HE_THONG hoặc CUA_HANG
        public LoaiGiamGia LoaiGiamGia { get; set; }              // % hoặc số tiền cố định

        public decimal GiaTriGiam { get; set; }                    // % hoặc số tiền
        public decimal? GiaTriGiamToiDa { get; set; }             // Trần giảm tối đa (dành cho %)
        public decimal GiaTriDonHangToiThieu { get; set; } = 0;   // Điều kiện đơn tối thiểu

        public DateTime NgayBatDau { get; set; }
        public DateTime NgayHetHan { get; set; }

        public int SoLuong { get; set; } = -1;                    // -1 = không giới hạn
        public int SoLuongDaDung { get; set; } = 0;

        // Farmer voucher: NguoiBanId != null. Admin voucher: NguoiBanId == null
        public Guid? NguoiBanId { get; set; }
        [ForeignKey("NguoiBanId")]
        public virtual NguoiDung? NguoiBan { get; set; }

        // Farmer voucher: áp dụng cho SanPhamDangId cụ thể (JSON array)
        // Admin voucher: áp dụng theo danh mục (JSON array of DanhMucId)
        public string? ApDungChoIds { get; set; }                  // JSON string: ["id1","id2"]

        public virtual ICollection<VoucherNguoiDung> VoucherNguoiDungs { get; set; } = new List<VoucherNguoiDung>();
    }
}
