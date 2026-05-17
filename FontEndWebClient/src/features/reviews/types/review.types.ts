// ── Một đánh giá ─────────────────────────────────────────────────────────────
export interface Review {
    id: string;
    nguoiDanhGiaId: string;
    tenNguoiDanhGia: string;
    anhDaiDienUrl?: string | null;
    soSao: number;
    binhLuan?: string | null;
    ngayTao: string;
    donHangId: string;
    sanPhamDangId: string;
}

// ── Tổng hợp đánh giá của sản phẩm ──────────────────────────────────────────
export interface ReviewSummary {
    diemTrungBinh: number;
    tongSoDanhGia: number;
    /** Index 0 = 1 sao … Index 4 = 5 sao */
    phanBoSao: number[];
    danhGias: Review[];
    trangHienTai: number;
    tongTrang: number;
}

// ── Request tạo đánh giá ─────────────────────────────────────────────────────
export interface TaoDanhGiaRequest {
    donHangId: string;
    sanPhamDangId: string;
    soSao: number;
    binhLuan?: string;
}

// ── Kiểm tra quyền đánh giá ──────────────────────────────────────────────────
export interface CoTheDanhGia {
    coThe: boolean;
    /** "ok" | "order_not_completed" | "already_reviewed" | "not_owner" */
    lyDo: string;
}
