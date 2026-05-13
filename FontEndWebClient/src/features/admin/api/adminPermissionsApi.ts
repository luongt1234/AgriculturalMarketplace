import axiosInstance from '../../../lip/axiosInstance';
import type { AdminFeaturePermission, AdminPermissionCode } from '../constants/adminPermissions';

export const adminPermissionsApi = {
    getFeatures: async (): Promise<AdminFeaturePermission[]> => {
        const response = await axiosInstance.get<AdminFeaturePermission[]>('/api/AdminPermissions/features');
        return response.data || [];
    },

    getMyPermissions: async (): Promise<AdminPermissionCode[]> => {
        const response = await axiosInstance.get<AdminPermissionCode[]>('/api/AdminPermissions/me');
        return response.data || [];
    },

    getUserPermissions: async (userId: string): Promise<AdminPermissionCode[]> => {
        const response = await axiosInstance.get<AdminPermissionCode[]>(`/api/AdminPermissions/user/${userId}`);
        return response.data || [];
    },

    updateUserPermissions: async (userId: string, permissionCodes: AdminPermissionCode[]) => {
        await axiosInstance.put(`/api/AdminPermissions/user/${userId}`, { permissionCodes });
    }
};
