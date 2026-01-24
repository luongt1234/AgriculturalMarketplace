namespace AgroMarket.Domain.Enums
{
    public enum TrangThaiDonHang
    {
        ChoXuLy,    // cho_xu_ly
        XacNhan,    // xac_nhan
        DangGiao,   // dang_giao
        HoanTat,    // hoan_tat
        Huy         // huy
    }

    public enum PhuongThucGiaoHang
    {
        TaiKho,     // tai_kho
        GiaoHang    // giao_hang
    }

    public enum TrangThaiSanPham
    {
        ConHang,    // con_hang
        HetHang     // het_hang
    }

    public enum TrangThaiThanhToan
    {
        Cho,        // cho
        ThanhCong,  // thanh_cong
        ThatBai     // that_bai
    }

    public enum PhuongThucThanhToan
    {
        COD,            // cod
        ChuyenKhoan,    // chuyen_khoan
        ViDienTu        // vi_dien_tu
    }

    public enum LoaiGiaoDichVi
    {
        NapTien,
        RutTien,
        ThanhToanDonHang,
        NhanTienBanHang,
        HoanTien
    }

    public enum TrangThaiHopDong
    {
        DeNghi,     // de_nghi
        ChapNhan,   // chap_nhan
        TuChoi,     // tu_choi
        HoanThanh,  // hoan_thanh
        Huy         // huy
    }

    public enum TrangThaiYeuCau
    {
        ChoDuyet,   // cho_duyet
        DaDuyet,    // da_duyet
        TuChoi      // tu_choi
    }

    public enum TrangThaiTinNhan
    {
        ChuaDoc,    // chua_doc
        DaDoc       // da_doc
    }
}