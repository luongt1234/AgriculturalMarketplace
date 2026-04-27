namespace AgroMarket.Domain.Enums
{
    public enum TrangThaiDonHang
    {
        // ── Giai đoạn 1: Khởi tạo ───────────────────────────────────────────────
        ChoXuLy,            // PENDING   – Buyer vừa đặt, chờ seller xác nhận
        XacNhan,            // CONFIRMED – Seller đã bấm "Chuẩn bị hàng"
        Huy,                // CANCELLED – Seller từ chối hoặc buyer huỷ

        // ── Giai đoạn 2: Giao hàng ──────────────────────────────────────────────
        DangGiao,           // SHIPPING  – Đã tạo vận đơn GHN
        DaGiao,             // DELIVERED – GHN webhook báo giao thành công

        // ── Giai đoạn 3a: Hoàn tất ──────────────────────────────────────────────
        HoanTat,            // COMPLETED – Buyer xác nhận đã nhận hàng

        // ── Giai đoạn 3b: Hoàn hàng ─────────────────────────────────────────────
        YeuCauHoan,         // RETURN_REQUESTED – Buyer yêu cầu hoàn trả
        DangHoan,           // RETURNING        – Seller đồng ý, GHN lấy hàng ngược
        DaHoan,             // RETURNED         – Seller nhận lại hàng
        TraChanh,           // DISPUTED         – Seller từ chối hoàn, Admin can thiệp
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