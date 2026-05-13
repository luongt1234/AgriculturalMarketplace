import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminHeader } from '../../layouts/components/AdminHeader';
import { DataTable, type Column } from '../../components/common/DataTable';
import axiosInstance from '../../lip/axiosInstance';
import type { NguoiDung } from '../../types/nguoiDung.type';
import type { DanhMuc } from '../../types/danhMuc.type';
import { AddUserModal } from '../../features/admin/components/AddUserModal';
import { EditUserModal } from '../../features/admin/components/EditUserModal';
import { DeleteUserModal } from '../../features/admin/components/DeleteUserModal';
import { AdminPermissionModal } from '../../features/admin/components/AdminPermissionModal';

const pageSize = 10;

const AdminManagement: React.FC = () => {
    const [admins, setAdmins] = useState<NguoiDung[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPermModalOpen, setIsPermModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [danhMucVaiTro, setDanhMucVaiTro] = useState<DanhMuc | undefined>();

    const fetchRoleData = async () => {
        try {
            const res = await axiosInstance.get<DanhMuc>('/api/DanhMuc/GetByMaGiaTri/ADMIN');
            if (res.data) setDanhMucVaiTro(res.data);
        } catch (err) {
            console.error('Lỗi lấy danh mục vai trò ADMIN:', err);
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

    useEffect(() => {
        fetchRoleData();
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
                    {user.anhDaiDienUrl ? (
                        <img src={user.anhDaiDienUrl} alt="" className="size-10 rounded-full object-cover border" />
                    ) : (
                        <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {user.hoTen?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-bold text-[#131613] dark:text-white truncate">{user.hoTen}</h4>
                        <p className="text-[11px] text-[#6b806c] truncate">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Địa chỉ',
            key: 'diaChi',
            render: (user) => <span className="text-sm">{user.diaChi || '---'}</span>
        },
        {
            header: 'Ngày đăng ký',
            key: 'ngayTao',
            render: (user) => (
                <span className="text-sm text-[#6b806c]">
                    {user.ngayTao ? new Date(user.ngayTao).toLocaleDateString('vi-VN') : '---'}
                </span>
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
            className: 'text-center',
            render: (user) => (
                <div className="flex items-center justify-center gap-1">
                    <button
                        onClick={() => { setSelectedUser(user); setIsPermModalOpen(true); }}
                        className="p-1.5 hover:text-primary transition-colors"
                        title="Phân quyền chức năng"
                    >
                        <span className="material-symbols-outlined text-[20px]">rule_settings</span>
                    </button>
                    <button
                        onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                        className="p-1.5 hover:text-primary transition-colors"
                        title="Chỉnh sửa"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                        className="p-1.5 hover:text-red-500 transition-colors"
                        title="Xóa"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Quản lý tài khoản quản trị"
                description="Quản trị viên có quyền điều hành và cấu hình toàn bộ hệ thống."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Tài khoản quản trị', isActive: true }
                ]}
                rightContent={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#246328] text-white transition-all font-bold text-sm uppercase tracking-widest shadow-sm"
                    >
                        <span className="material-symbols-outlined icon-filled text-[18px]">person_add</span>
                        Thêm mới
                    </button>
                }
            />

            <div className="flex flex-col mt-6">
                <div className="bg-white dark:bg-[#1a261c] p-4 rounded-t-xl border border-[#dee3de] dark:border-gray-700 border-b-0 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b806c]">search</span>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm outline-none"
                                placeholder="Tìm quản trị viên..."
                                type="text"
                            />
                        </div>
                        <div className="h-10 w-px bg-[#dee3de] dark:bg-gray-700 mx-1"></div>
                        <div className="flex bg-[#f1f3f1] dark:bg-[#253326] p-1 rounded-lg">
                            {['Tất cả', 'Hoạt động', 'Khóa'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === tab
                                        ? 'bg-white dark:bg-[#1a261c] text-[#131613] dark:text-white shadow-sm border border-[#dee3de]'
                                        : 'text-[#6b806c] hover:text-[#131613]'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
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

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAdmins}
                danhMucVaiTro={danhMucVaiTro}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
                onSuccess={fetchAdmins}
                user={selectedUser}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
                onSuccess={fetchAdmins}
                user={selectedUser}
            />

            <AdminPermissionModal
                isOpen={isPermModalOpen}
                onClose={() => { setIsPermModalOpen(false); setSelectedUser(null); }}
                user={selectedUser}
            />
        </div>
    );
};

export default AdminManagement;
