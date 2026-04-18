import axiosInstance from '../../../lip/axiosInstance';
import type { CartDto, CartItemDto, AddToCartDto, UpdateQuantityDto } from '../../../types/cart.types';

export const cartApi = {
    getCart: async (): Promise<CartDto> => {
        const response = await axiosInstance.get<CartDto>('/api/GioHang');
        return response.data;
    },

    addItem: async (data: AddToCartDto): Promise<CartDto> => {
        const response = await axiosInstance.post<CartDto>('/api/GioHang/them', data);
        return response.data;
    },

    updateQuantity: async (chiTietId: string, data: UpdateQuantityDto): Promise<CartDto> => {
        const response = await axiosInstance.put<CartDto>(`/api/GioHang/${chiTietId}/so-luong`, data);
        return response.data;
    },

    removeItem: async (chiTietId: string): Promise<CartDto> => {
        const response = await axiosInstance.delete<CartDto>(`/api/GioHang/${chiTietId}`);
        return response.data;
    },

    clearCart: async (): Promise<void> => {
        await axiosInstance.delete('/api/GioHang/clear');
    },
};