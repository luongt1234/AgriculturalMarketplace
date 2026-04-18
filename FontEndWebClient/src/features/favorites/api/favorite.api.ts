// import { apiClient } from '../../../utils/api';

import axiosInstance from "../../../lip/axiosInstance";

export interface FavoriteProductDto {
    sanPhamYeuThichId: string;
    sanPhamDangId: string;
    tenHienThi: string;
    gia: number;
    hinhAnhUrl: string;
    nguoiBanId: string;
    tenCuaHang: string;
    ngayYeuThich: string;
}

export const favoriteApi = {
    getFavorites: () =>
        axiosInstance.get<FavoriteProductDto[]>('api/SanPhamYeuThich'),

    getFavoriteIds: () =>
        axiosInstance.get<string[]>('api/SanPhamYeuThich/ids'),

    toggleFavorite: (sanPhamDangId: string) =>
        axiosInstance.post<{ isFavorited: boolean }>(`api/SanPhamYeuThich/toggle/${sanPhamDangId}`)
};
