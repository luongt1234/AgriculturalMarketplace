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
    items: ChiTietDonHangRequest[];
}

export interface TaoDonHangResponse {
    donHangId: string;
    trangThai: string;
    tongTien: number;
    phiVanChuyen: number;
    tongThanhToan: number;
    ngayTao: string;
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
