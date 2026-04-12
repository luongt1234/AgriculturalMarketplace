import axiosInstance from "../../../lip/axiosInstance";
import type { DiaChiNguoiDungDto, DiaChiNguoiDungFormDto } from "../../../types/checkout.types";

// API Lấy tất cả địa chỉ của người dùng hiện tại
export const getUserAddresses = async (): Promise<DiaChiNguoiDungDto[]> => {
    const response = await axiosInstance.get('/api/DiaChiNguoiDung');
    return response.data.data || response.data;
};

// API Lấy địa chỉ theo ID
export const getAddressById = async (id: string): Promise<DiaChiNguoiDungDto> => {
    const response = await axiosInstance.get(`/api/DiaChiNguoiDung/${id}`);
    return response.data.data || response.data;
};

// API Tạo địa chỉ mới
export const createAddress = async (data: DiaChiNguoiDungFormDto): Promise<DiaChiNguoiDungDto> => {
    const response = await axiosInstance.post('/api/DiaChiNguoiDung', data);
    return response.data.data || response.data;
};

// API Cập nhật địa chỉ
export const updateAddress = async (id: string, data: DiaChiNguoiDungFormDto): Promise<void> => {
    await axiosInstance.put(`/api/DiaChiNguoiDung/${id}`, data);
};

// API Xóa địa chỉ
export const deleteAddress = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/DiaChiNguoiDung/${id}`);
};

// API Lấy địa chỉ phân trang
export const getAddressesPaged = async (pageNumber: number = 1, pageSize: number = 10) => {
    const response = await axiosInstance.get(`/api/DiaChiNguoiDung/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
};