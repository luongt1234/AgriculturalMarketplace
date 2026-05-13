import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminPermissionsApi } from '../api/adminPermissionsApi';
import type { AdminPermissionCode } from '../constants/adminPermissions';
import { useAuthStore } from '../../../store/useAuthStore';

let cachedPermissions: AdminPermissionCode[] | null = null;

export const useAdminPermissions = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [permissions, setPermissions] = useState<AdminPermissionCode[]>(cachedPermissions || []);
    const [loading, setLoading] = useState(!cachedPermissions);

    const refresh = useCallback(async () => {
        if (!isAuthenticated || user?.maVaiTro !== 'ADMIN') {
            cachedPermissions = [];
            setPermissions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await adminPermissionsApi.getMyPermissions();
            cachedPermissions = data;
            setPermissions(data);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user?.maVaiTro]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const permissionSet = useMemo(() => new Set(permissions), [permissions]);

    return {
        permissions,
        loading,
        refresh,
        hasPermission: (permissionCode: AdminPermissionCode) => permissionSet.has(permissionCode)
    };
};
