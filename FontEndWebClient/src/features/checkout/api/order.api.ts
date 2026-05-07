import axiosInstance from "../../../lip/axiosInstance";


export interface ChiTietDonHangRequest {
    sanPhamDangId: string;
    soLuong: number;
    donGia: number;
}

export interface TaoDonHangRequest {
    diaChiGiaoHangId: string;
    /** JSON-stringified address blob */
    diaChiGiaoHang: string;
    tenNguoiNhan: string;
    soDienThoai: string;
    nguoiBanId: string;
    phiVanChuyen: number;
    ghnServiceId?: number;
    ghiChu?: string;
    /** 'COD' hoặc 'MoMo' */
    phuongThucThanhToan?: string;
    items: ChiTietDonHangRequest[];
}

export interface TaoDonHangResponse {
    donHangId: string;
    trangThai: string;
    tongTien: number;
    phiVanChuyen: number;
    tongThanhToan: number;
    ngayTao: string;
    /** URL trang thanh toán MoMo — chỉ có khi dùng MoMo */
    momoPayUrl?: string;
    /** Chuỗi QR EMVCO để render QR code — chỉ có khi dùng MoMo */
    momoQrCodeUrl?: string;
}

// ── API calls ────────────────────────────────────────────────────────────────

/**
 * Buyer đặt đơn hàng (COD hoặc bất kỳ phương thức nào).
 * POST /api/DonHang
 */
export async function taoDonHang(payload: TaoDonHangRequest): Promise<TaoDonHangResponse> {
    const response = await axiosInstance.post<TaoDonHangResponse>('/api/DonHang', payload);
    return response.data;
}

/**
 * Buyer xác nhận đã nhận hàng.
 * PUT /api/DonHang/{id}/confirm-received
 */
export async function buyerXacNhanDaNhan(donHangId: string): Promise<void> {
    await axiosInstance.put(`/api/DonHang/${donHangId}/confirm-received`);
}

/**
 * Seller lấy danh sách đơn hàng của shop mình.
 * GET /api/DonHang/seller-orders
 */
export async function getSellerOrders(params?: {
    pageNumber?: number;
    pageSize?: number;
    trangThai?: string;
}) {
    const response = await axiosInstance.get('/api/DonHang/seller-orders', { params });
    return response;
}

/**
 * Seller xác nhận đơn (CONFIRMED).
 * PUT /api/DonHang/{id}/accept
 */
export async function sellerXacNhan(donHangId: string): Promise<void> {
    await axiosInstance.put(`/api/DonHang/${donHangId}/accept`);
}

/**
 * Seller từ chối đơn (CANCELLED).
 * PUT /api/DonHang/{id}/reject
 */
export async function sellerTuChoi(donHangId: string): Promise<void> {
    await axiosInstance.put(`/api/DonHang/${donHangId}/reject`);
}

/**
 * Seller chuyển sang giao hàng (SHIPPING).
 * PUT /api/DonHang/{id}/ship
 */
export async function sellerGiaoHang(donHangId: string): Promise<void> {
    await axiosInstance.put(`/api/DonHang/${donHangId}/ship`);
}

/**
 * Lấy số dư ví hiện tại của người dùng đang đăng nhập.
 * GET /api/NguoiDung/me/so-du
 */
export async function getSoDu(): Promise<number> {
    const response = await axiosInstance.get<{ soDu: number }>('/api/NguoiDung/me/so-du');
    return response.data.soDu;
}

/**
 * Buyer hủy đơn hàng (chỉ khi ChoXuLy). MoMo tự động hoàn tiền.
 * POST /api/DonHang/{id}/buyer-huy
 */
export async function buyerHuyDonHang(donHangId: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(`/api/DonHang/${donHangId}/buyer-huy`);
    return response.data;
}
