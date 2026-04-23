import axiosInstance from "../../../lip/axiosInstance";
import type { CaiDatGiaoDienDto, UpdateCaiDatGiaoDienDto } from "../../../types/settings.types";

export const settingsApi = {
    getSettings: async (): Promise<CaiDatGiaoDienDto> => {
        const response = await axiosInstance.get('/api/CaiDatGiaoDien');
        return response.data;
    },

    updateSettings: async (data: UpdateCaiDatGiaoDienDto): Promise<CaiDatGiaoDienDto> => {
        const response = await axiosInstance.put('/api/CaiDatGiaoDien', data);
        return response.data;
    }
};
