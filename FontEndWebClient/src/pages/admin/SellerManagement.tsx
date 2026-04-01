import React, { useEffect, useState, useMemo } from 'react';
import { AdminHeader } from '../../layouts/components/AdminHeader';
import type { NguoiDung } from '../../types/nguoiDung.type';
import { toast } from 'sonner';
import { AddUserModal } from '../../features/admin/components/AddUserModal';
import type { DanhMuc } from '../../types/danhMuc.type';
import { EditUserModal } from '../../features/admin/components/EditUserModal';
import { DeleteUserModal } from '../../features/admin/components/DeleteUserModal';

// Import DataTable component dùng chung
import { DataTable, type Column } from '../../components/common/DataTable';
import axiosInstance from '../../lip/axiosInstance';

const SellerManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [buyers, setBuyers] = useState<NguoiDung[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [danhMucVaiTro, setDanhMucVaiTro] = useState<DanhMuc>();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchDataDanhMucVaiTroNguoiDung = async () => {
        try {
            const res = await axiosInstance.get(`/api/DanhMuc/GetByMaGiaTri/NONG-DAN`);
            if (res.data) {
                setDanhMucVaiTro(res.data);
            }
        } catch (err: any) {
            console.log(`Lỗi lấy danh mục vai trò: ${err}`);
        }
    }

    const fetchDataNguoiDung = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `/api/NguoiDung/GetByMa/NONG-DAN?pageNumber=${pageNumber}&pageSize=${pageSize}`
            );

            if (res) {
                setBuyers(res.data || []);
                setTotal(res.totalRecords || 0);
            }
        } catch (err: any) {
            console.log(`Lỗi khi lấy danh sách người bán: ${err}`);
            toast.error(`Lỗi lấy danh sách người dùng`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataNguoiDung();
    }, [pageNumber, pageSize]);

    useEffect(() => {
        fetchDataDanhMucVaiTroNguoiDung();
    }, []);

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage);
    };

    // Định nghĩa cấu trúc các cột cho DataTable
    const columns = useMemo<Column<NguoiDung>[]>(() => [
        {
            header: 'Tài khoản người bán',
            key: 'hoTen',
            render: (user) => (
                <div className="flex items-center gap-3">
                    {user.anhDaiDienUrl ? (
                        <div
                            className="size-10 rounded-full bg-center bg-cover border"
                            style={{ backgroundImage: `url(${user.anhDaiDienUrl})` }}
                        />
                    ) : (
                        <div className="size-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 font-bold uppercase">
                            {user.hoTen?.charAt(0) || '?'}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-bold text-[#131613] dark:text-white truncate">
                            {user.hoTen}
                        </h4>
                        <p className="text-[11px] text-[#6b806c] dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: 'Địa điểm',
            key: 'diaChi',
            render: (user) => (
                <span className="text-sm text-[#131613] dark:text-white">
                    {user.diaChi || '---'}
                </span>
            )
        },
        {
            header: 'Số dư',
            key: 'soDu',
            className: 'text-center',
            render: (user) => (
                <span className="text-sm font-bold text-[#131613] dark:text-white">
                    {user.soDu?.toLocaleString('vi-VN')} đ
                </span>
            )
        },
        {
            header: 'Ngày đăng ký',
            key: 'ngayTao',
            render: (user) => (
                <span className="text-sm text-[#6b806c] dark:text-gray-400">
                    {user.ngayTao
                        ? new Date(user.ngayTao).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })
                        : '---'}
                </span>
            )
        },
        {
            header: 'Trạng thái',
            key: 'kichHoat',
            className: 'text-center',
            render: (user) => (
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.kichHoat
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                >
                    {user.kichHoat ? 'Hoạt động' : 'Khóa'}
                </span>
            )
        },
        {
            header: 'Hành động',
            key: 'action',
            className: 'text-right',
            render: (user) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        className="p-1.5 hover:text-primary transition-colors"
                        onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                        }}
                        title="Chỉnh sửa"
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                        className="p-1.5 hover:text-red-500 transition-colors"
                        onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                        }}
                        title="Xóa người dùng"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            )
        }
    ], []); // Sử dụng useMemo để tránh việc tạo lại tham chiếu hàm mỗi lần component re-render

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Quản lý người bán"
                description="Xem xét, xác minh và quản lý các tài khoản người bán trong lĩnh vực nông nghiệp."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Quản lý người bán', isActive: true }
                ]}
                rightContent={
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#246328] text-white transition-all font-bold text-sm uppercase tracking-widest shadow-sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="material-symbols-outlined icon-filled text-[18px]">person_add</span>
                        Thêm mới
                    </button>
                }
            />

            <div className="flex flex-col">
                {/* Search & Filter Controls */}
                <div className="bg-white dark:bg-[#1a261c] p-4 rounded-t-xl border border-[#dee3de] dark:border-gray-700 border-b-0 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#6b806c]">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none"
                                placeholder="Tìm kiếm theo tên, SĐT hoặc email..."
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
                                        ? 'bg-white dark:bg-[#1a261c] text-[#131613] dark:text-white shadow-sm border border-[#dee3de] dark:border-gray-700'
                                        : 'text-[#6b806c] dark:text-gray-400 hover:text-[#131613] dark:hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#dee3de] dark:border-gray-700 text-[#131613] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Lọc
                    </button>
                </div>

                {/* Data Table Section */}
                <DataTable
                    data={buyers}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        pageNumber,
                        pageSize,
                        total,
                        onPageChange: handlePageChange
                    }}
                    emptyMessage="Hiện tại chưa có dữ liệu người bán nào được ghi nhận trong hệ thống."
                />
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDataNguoiDung}
                danhMucVaiTro={danhMucVaiTro}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={fetchDataNguoiDung}
                user={selectedUser}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={fetchDataNguoiDung}
                user={selectedUser}
            />
        </div>
    );
};

export default SellerManagement;