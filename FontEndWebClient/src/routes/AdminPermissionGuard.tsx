import { Navigate, Outlet } from 'react-router-dom';
import { useAdminPermissions } from '../features/admin/hooks/useAdminPermissions';
import type { AdminPermissionCode } from '../features/admin/constants/adminPermissions';

interface AdminPermissionGuardProps {
    permission: AdminPermissionCode;
}

export const AdminPermissionGuard = ({ permission }: AdminPermissionGuardProps) => {
    const { loading, hasPermission } = useAdminPermissions();

    if (loading) {
        return <div className="p-10 text-center text-primary">Đang tải...</div>;
    }

    if (!hasPermission(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
