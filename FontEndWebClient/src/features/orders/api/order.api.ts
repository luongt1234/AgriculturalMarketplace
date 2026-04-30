import axiosInstance from '../../../lip/axiosInstance';

export interface ChiTietDonHangDto {
    id: string;
    sanPhamDangId: string;
    tenSanPham: string | null;
    hinhAnhUrl: string | null;
    soLuong: number;
    donGia: number;
    thanhTien: number;
}

export interface DonHangDto {
    id: string;
    ngayTao: string;
    nguoiMuaId: string;
    nguoiBanId: string;
    tenNguoiBan: string | null;
    anhDaiDienNguoiBan: string | null;
    tongTien: number;
    phiVanChuyen: number;
    tongThanhToan: number;
    trangThai: string;
    trangThaiLabel: string | null;
    diaChiGiaoHang: string | null;
    ghiChu: string | null;
    chiTiet: ChiTietDonHangDto[];
}

export interface GetMyOrdersParams {
    pageNumber?: number;
    pageSize?: number;
    trangThai?: string;
}

export const getMyOrders = async (params: GetMyOrdersParams = {}) => {
    const { pageNumber = 1, pageSize = 10, trangThai } = params;
    const query = new URLSearchParams();
    query.append('pageNumber', pageNumber.toString());
    query.append('pageSize', pageSize.toString());
    if (trangThai) query.append('trangThai', trangThai);

    const res = await axiosInstance.get(`/api/DonHang/my-orders?${query.toString()}`);
    return res;
};

/** Buyer xác nhận đã nhận hàng → HoanTat */
export const buyerXacNhanDaNhan = async (donHangId: string): Promise<void> => {
    await axiosInstance.put(`/api/DonHang/${donHangId}/confirm-received`);
};
