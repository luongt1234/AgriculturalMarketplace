namespace AgroMarket.Application.DTOs.Voucher
{
    public class VoucherDto
    {
        public Guid Id { get; set; }
        public string MaCode { get; set; } = string.Empty;
        public string TenVoucher { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string LoaiVoucher { get; set; } = string.Empty;   // HE_THONG | CUA_HANG
        public string LoaiGiamGia { get; set; } = string.Empty;   // PHAN_TRAM | SO_TIEN_CO_DINH
        public decimal GiaTriGiam { get; set; }
        public decimal? GiaTriGiamToiDa { get; set; }
        public decimal GiaTriDonHangToiThieu { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int SoLuong { get; set; }
        public int SoLuongDaDung { get; set; }
        public Guid? NguoiBanId { get; set; }
        public string? TenNguoiBan { get; set; }
        public string? ApDungChoIds { get; set; }
        public bool ConHieuLuc { get; set; }
        public bool ConSoLuong { get; set; }
    }

    public class CreateVoucherDto
    {
        public string MaCode { get; set; } = string.Empty;
        public string TenVoucher { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string LoaiGiamGia { get; set; } = "PHAN_TRAM";
        public decimal GiaTriGiam { get; set; }
        public decimal? GiaTriGiamToiDa { get; set; }
        public decimal GiaTriDonHangToiThieu { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int SoLuong { get; set; } = -1;
        public string? ApDungChoIds { get; set; }       // JSON string
    }

    public class UpdateVoucherDto
    {
        public string TenVoucher { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public decimal GiaTriGiam { get; set; }
        public decimal? GiaTriGiamToiDa { get; set; }
        public decimal GiaTriDonHangToiThieu { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int SoLuong { get; set; }
        public string? ApDungChoIds { get; set; }
    }

    // Dành cho Buyer xem trên trang Shop
    public class VoucherPublicDto
    {
        public Guid Id { get; set; }
        public string MaCode { get; set; } = string.Empty;
        public string TenVoucher { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string LoaiGiamGia { get; set; } = string.Empty;
        public decimal GiaTriGiam { get; set; }
        public decimal? GiaTriGiamToiDa { get; set; }
        public decimal GiaTriDonHangToiThieu { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int SoLuongConLai { get; set; }
        public bool DaLay { get; set; }
    }

    // Kết quả validate khi nhập code ở checkout
    public class ValidateVoucherResultDto
    {
        public bool HopLe { get; set; }
        public string? LoiMessage { get; set; }
        public Guid? VoucherId { get; set; }
        public string? LoaiGiamGia { get; set; }
        public decimal SoTienGiam { get; set; }
        public decimal GiaTriDonHangSauGiam { get; set; }
    }
}
