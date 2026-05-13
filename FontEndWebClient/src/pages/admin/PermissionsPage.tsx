import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminHeader } from '../../layouts/components/AdminHeader';
import { DataTable, type Column } from '../../components/common/DataTable';
import axiosInstance from '../../lip/axiosInstance';
import type { NguoiDung } from '../../types/nguoiDung.type';
import { adminPermissionsApi } from '../../features/admin/api/adminPermissionsApi';
import type { AdminFeaturePermission, AdminPermissionCode } from '../../features/admin/constants/adminPermissions';

const pageSize = 10;

const PermissionsPage: React.FC = () => {
    const [admins, setAdmins] = useState<NguoiDung[]>([]);
    const [features, setFeatures] = useState<AdminFeaturePermission[]>([]);
    const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<AdminPermissionCode[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchFeatures = async () => {
        try {
            setFeatures(await adminPermissionsApi.getFeatures());
        } catch (err) {
            toast.error('Không thể tải danh sách chức năng');
        }
    };

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get<NguoiDung[]>(
                `/api/NguoiDung/GetByMa/ADMIN?pageNumber=${pageNumber}&pageSize=${pageSize}`
            );
            setAdmins(res.data || []);
            setTotal(res.totalRecords || 0);
        } catch (err) {
            toast.error('Không thể tải danh sách quản trị viên');
        } finally {
            setLoading(false);
        }
    }, [pageNumber]);

    const openPermissionEditor = async (user: NguoiDung) => {
        setSelectedUser(user);
        try {
            const permissions = await adminPermissionsApi.getUserPermissions(user.id);
            setSelectedPermissions(permissions);
        } catch (err) {
            toast.error('Không thể tải phân quyền của tài khoản');
        }
    };

    const togglePermission = (permissionCode: AdminPermissionCode) => {
        setSelectedPermissions((current) =>
            current.includes(permissionCode)
                ? current.filter((code) => code !== permissionCode)
                : [...current, permissionCode]
        );
    };

    const savePermissions = async () => {
        if (!selectedUser) return;

        setSaving(true);
        try {
            await adminPermissionsApi.updateUserPermissions(selectedUser.id, selectedPermissions);
            toast.success('Cập nhật phân quyền thành công');
            setSelectedUser(null);
            setSelectedPermissions([]);
        } catch (err) {
            toast.error('Không thể cập nhật phân quyền');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const columns: Column<NguoiDung>[] = [
        {
            header: 'Tài khoản quản trị',
            key: 'hoTen',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.hoTen?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-[#131613] dark:text-white truncate">{user.hoTen}</p>
                        <p className="text-[11px] text-[#6b806c] truncate">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Trạng thái',
            key: 'kichHoat',
            className: 'text-center',
            render: (user) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.kichHoat
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {user.kichHoat ? 'Hoạt động' : 'Khóa'}
                </span>
            )
        },
        {
            header: 'Hành động',
            key: 'actions',
            className: 'text-right',
            render: (user) => (
                <button
                    onClick={() => openPermissionEditor(user)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#dee3de] text-sm font-semibold hover:text-primary hover:border-primary/40 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">rule_settings</span>
                    Cấu hình quyền
                </button>
            )
        }
    ];

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Phân quyền chức năng admin"
                description="Chọn tài khoản quản trị được sử dụng từng chức năng trong khu vực admin."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Phân quyền', isActive: true }
                ]}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5 mt-6">
                <div className="flex flex-col">
                    <div className="bg-white dark:bg-[#1a261c] p-4 rounded-t-xl border border-[#dee3de] dark:border-gray-700 border-b-0">
                        <p className="text-sm font-bold text-[#131613] dark:text-white">Tài khoản quản trị</p>
                    </div>
                    <DataTable
                        data={admins}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            pageNumber,
                            pageSize,
                            total,
                            onPageChange: (page) => setPageNumber(page)
                        }}
                        emptyMessage="Không tìm thấy tài khoản quản trị nào."
                    />
                </div>

                <aside className="border border-[#dee3de] dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a261c] h-fit overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                        <p className="text-sm font-bold text-[#131613] dark:text-white">
                            {selectedUser ? selectedUser.hoTen : 'Chọn tài khoản'}
                        </p>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                            {selectedUser ? selectedUser.email : 'Chọn một quản trị viên để cấu hình quyền chức năng.'}
                        </p>
                    </div>

                    <div className="p-5 space-y-3">
                        {features.map((feature) => (
                            <label
                                key={feature.code}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${selectedUser
                                    ? 'border-[#dee3de] dark:border-gray-700 hover:border-primary/40 cursor-pointer'
                                    : 'border-[#dee3de] dark:border-gray-700 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    disabled={!selectedUser}
                                    checked={selectedPermissions.includes(feature.code)}
                                    onChange={() => togglePermission(feature.code)}
                                    className="size-4 accent-primary"
                                />
                                <span className="text-sm font-semibold text-[#131613] dark:text-white">{feature.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="px-5 py-4 border-t border-[#dee3de] dark:border-gray-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { setSelectedUser(null); setSelectedPermissions([]); }}
                            className="px-4 py-2 rounded-lg text-sm font-bold text-[#6b806c] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            disabled={!selectedUser || saving}
                            onClick={savePermissions}
                            className="px-4 py-2 rounded-lg bg-primary hover:bg-[#246328] text-white text-sm font-bold disabled:opacity-50 transition-colors"
                        >
                            Lưu quyền
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PermissionsPage;
