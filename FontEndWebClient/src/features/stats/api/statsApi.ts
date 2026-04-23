// import axiosClient from '../../../lib/axios';

import axiosInstance from "../../../lip/axiosInstance";

export interface FarmerDashboardStatsDto {
    tongDoanhThu: number;
    bieuDoDoanhThu_TangGiamPhanTram: number;
    donChoXuLy: number;
    donMoiNhat: number;
    sanPhamSapHet: number;
    danhGiaShop: number;
}

export interface AdminDashboardStatsDto {
    tongGmv: number;
    doanhThuThuan: number;
    nguoiBanHoatDong: number;
    nguoiDungMoi: number;
}

export const statsApi = {
    getFarmerStats: async (): Promise<{ data: FarmerDashboardStatsDto }> => {
        const response = await axiosInstance.get('/api/ThongKe/farmer-dashboard');
        return response.data; // axiosClient usually returns the payload or wrapper
    },

    getAdminStats: async (): Promise<{ data: AdminDashboardStatsDto }> => {
        const response = await axiosInstance.get('/api/ThongKe/admin-dashboard');
        return response.data;
    }
};
