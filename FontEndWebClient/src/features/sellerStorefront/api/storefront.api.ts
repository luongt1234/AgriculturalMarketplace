import axiosInstance from '../../../lip/axiosInstance';

const BASE = '/api/CuaHang';

export interface SellerProfile {
    id: string;
    hoTen: string;
    anhDaiDienUrl?: string;
    anhBiaUrl?: string;
    moTaCuaHang?: string;
    diaChi?: string;
    soDienThoai?: string;
    diemUyTin: number;
    ngayThamGia: string;
    soSanPham: number;
    soNguoiTheoDoi: number;
    dangTheoDoi: boolean;
    danhGiaTrungBinh: number;
    tiLePhanhHoi: number;
}

export interface SellerProduct {
    id: string;
    tenHienThi: string;
    hinhAnhUrl?: string;
    gia: number;
    tenDonVi?: string;
    tenChatLuong?: string;
    tenSanPhamChung?: string;
    soLuong: number;
    trangThai: string;
    isGhim: boolean;
    ngayDang: string;
}

export interface SellerProductsResponse {
    data: SellerProduct[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}

// ─── READ ──────────────────────────────────────────────────────────────────
export const getSellerProfile = async (sellerId: string): Promise<SellerProfile> => {
    const res = await axiosInstance.get<SellerProfile>(`${BASE}/${sellerId}`);
    return (res as any).data;
};

export const getSellerProducts = async (
    sellerId: string,
    page = 1,
    pageSize = 9,
    search?: string,
    category?: string
): Promise<SellerProductsResponse> => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await axiosInstance.get<SellerProductsResponse>(`${BASE}/${sellerId}/products?${params}`);
    return res as any;
};

// ─── CREATE (Follow) ────────────────────────────────────────────────────────
export const followSeller = async (sellerId: string): Promise<void> => {
    await axiosInstance.post(`${BASE}/${sellerId}/theo-doi`);
};

// ─── DELETE (Unfollow) ──────────────────────────────────────────────────────
export const unfollowSeller = async (sellerId: string): Promise<void> => {
    await axiosInstance.delete(`${BASE}/${sellerId}/theo-doi`);
};

// ─── READ (check) ───────────────────────────────────────────────────────────
export const checkFollow = async (sellerId: string): Promise<boolean> => {
    const res = await axiosInstance.get<boolean>(`${BASE}/${sellerId}/theo-doi/check`);
    return (res as any).data ?? false;
};

// ─── SETTINGS ───────────────────────────────────────────────────────────────
export interface StoreSettings {
    hoTen: string;
    anhDaiDienUrl?: string;
    anhBiaUrl?: string;
    moTaCuaHang?: string;
    diaChi?: string;
    soDienThoai?: string;
}

export const getMyShop = async (): Promise<StoreSettings> => {
    const res = await axiosInstance.get<StoreSettings>(`${BASE}/my-shop`);
    return (res as any).data;
};

export const updateMyShop = async (dto: StoreSettings): Promise<void> => {
    await axiosInstance.put(`${BASE}/my-shop`, dto);
};
