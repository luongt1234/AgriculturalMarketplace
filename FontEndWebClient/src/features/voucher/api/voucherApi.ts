import axiosInstance from '../../../lip/axiosInstance';
import type { CreateVoucherDto, UpdateVoucherDto, VoucherDto, VoucherPublicDto, ValidateVoucherResultDto } from '../../../types/voucher.types';

export const voucherApi = {
    // Admin
    getAdminVouchers: async (): Promise<VoucherDto[]> => {
        const res = await axiosInstance.get('/api/Voucher/admin');
        return res.data;
    },
    createAdminVoucher: async (dto: CreateVoucherDto): Promise<VoucherDto> => {
        const res = await axiosInstance.post('/api/Voucher/admin', dto);
        return res.data;
    },

    // Farmer
    getFarmerVouchers: async (): Promise<VoucherDto[]> => {
        const res = await axiosInstance.get('/api/Voucher/farmer');
        return res.data;
    },
    createFarmerVoucher: async (dto: CreateVoucherDto): Promise<VoucherDto> => {
        const res = await axiosInstance.post('/api/Voucher/farmer', dto);
        return res.data;
    },

    // Shared
    updateVoucher: async (id: string, dto: UpdateVoucherDto): Promise<VoucherDto> => {
        const res = await axiosInstance.put(`/api/Voucher/${id}`, dto);
        return res.data;
    },
    deleteVoucher: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/api/Voucher/${id}`);
    },

    // Buyer: Shop
    getShopVouchers: async (sellerId: string): Promise<VoucherPublicDto[]> => {
        const res = await axiosInstance.get(`/api/Voucher/shop/${sellerId}`);
        return res.data;
    },
    claimVoucher: async (voucherId: string): Promise<{ code: string }> => {
        const res = await axiosInstance.post(`/api/Voucher/${voucherId}/claim`);
        return res.data;
    },

    // Buyer: My
    getMyVouchers: async (): Promise<VoucherDto[]> => {
        const res = await axiosInstance.get('/api/Voucher/my');
        return res.data;
    },

    // Checkout
    validateVoucher: async (
        maCode: string,
        tongTienDonHang: number,
        sanPhamDangIds: string[]
    ): Promise<ValidateVoucherResultDto> => {
        const res = await axiosInstance.post('/api/Voucher/validate', {
            maCode,
            tongTienDonHang,
            sanPhamDangIds
        });
        return res.data;
    },

    // Homepage discounts
    getDiscountsForProducts: async (sanPhamDangIds: string[]): Promise<Record<string, number>> => {
        if (!sanPhamDangIds.length) return {};
        const res = await axiosInstance.post('/api/Voucher/discounts', sanPhamDangIds);
        return res.data ?? {};
    },
};
