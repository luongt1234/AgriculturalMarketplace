using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class DonHang : BaseEntity
    {
        public Guid NguoiMuaId { get; set; } // nguoi_mua_id
        [ForeignKey("NguoiMuaId")]
        public virtual NguoiDung NguoiMua { get; set; } = null!;

        public Guid NguoiBanId { get; set; } // nguoi_ban_id
        [ForeignKey("NguoiBanId")]
        public virtual NguoiDung NguoiBan { get; set; } = null!;

        public decimal TongTien { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PhiVanChuyen { get; set; } = 0;

        [MaxLength(50)]
        public string? MaVanDonGhn { get; set; }

        /// <summary>requestId gửi lên MoMo khi tạo thanh toán — dùng để refund sau</summary>
        [MaxLength(100)]
        public string? MoMoRequestId { get; set; }

        /// <summary>transId trả về từ MoMo IPN sau khi buyer thanh toán</summary>
        public long? MoMoTransId { get; set; }

        [MaxLength(500)]
        public string? DiaChiGiaoHang { get; set; }
        /*
            {
                "code": 8,
                "name": "Tỉnh Tuyên Quang",
                "division_type": "tỉnh",
                "codename": "tinh_tuyen_quang",
                "phone_code": 207,
                "districts": [
                    {
                        "code": 73,
                        "name": "Huyện Chiêm Hóa",
                        "division_type": "huyện",
                        "codename": "huyen_chiem_hoa",
                        "province_code": 8,
                        "wards": [
                            {
                                "code": 2311,
                                "name": "Xã Hà Lang",
                                "division_type": "xã",
                                "codename": "xa_ha_lang",
                                "district_code": 73
                            }
                        ]
                    }
                ]
            }
         */

        [MaxLength(100)]
        public string? ToaDoGiaoHang { get; set; }

        public TrangThaiDonHang TrangThai { get; set; } = TrangThaiDonHang.ChoXuLy;

        public string? GhiChu { get; set; } // ghi_chu_mua

        public PhuongThucGiaoHang PhuongThucNhanHang { get; set; } = PhuongThucGiaoHang.TaiKho; // phuong_thuc_nhan_hang

        public PhuongThucThanhToan PhuongThucThanhToan { get; set; } = PhuongThucThanhToan.COD; // phuong_thuc_thanh_toan

        public bool IsDatHangTruoc { get; set; } = false; // is_dat_hang (Pre-order)

        public virtual ICollection<ChiTietDonHang> ChiTietDonHang { get; set; } = new List<ChiTietDonHang>();
        public virtual ICollection<ThanhToan> CacThanhToan { get; set; } = new List<ThanhToan>();

        [NotMapped]
        public decimal TongThanhToan => TongTien + PhiVanChuyen;
    }
}