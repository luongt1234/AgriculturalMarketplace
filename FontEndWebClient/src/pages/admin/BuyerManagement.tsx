import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Tầng Giao diện chung (Shared UI)
import { AdminHeader } from '../../layouts/components/AdminHeader';
import { DataTable, type Column } from '../../components/common/DataTable';

// Tầng Dữ liệu & Tiện ích
import axiosInstance from '../../lip/axiosInstance';
import type { NguoiDung } from '../../types/nguoiDung.type';
import type { DanhMuc } from '../../types/danhMuc.type';

// Tầng Nghiệp vụ (Features)
import { AddUserModal } from '../../features/admin/components/AddUserModal';
import { EditUserModal } from '../../features/admin/components/EditUserModal';
import { DeleteUserModal } from '../../features/admin/components/DeleteUserModal';

const BuyerManagement: React.FC = () => {
    // --- 1. Quản lý Trạng thái (State Management) ---
    const [buyers, setBuyers] = useState<NguoiDung[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;

    // Trạng thái Modals
    const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    // Dữ liệu hỗ trợ (MetaData)
    const [danhMucVaiTro, setDanhMucVaiTro] = useState<DanhMuc | undefined>();
    const [searchTerm, setSearchTerm] = useState<string>("");

    // --- 2. Xử lý Dữ liệu (Data Fetching) ---

    // Lấy thông tin danh mục vai trò (để truyền vào modal thêm mới)
    const fetchRoleData = async () => {
        try {
            const res = await axiosInstance.get(`/api/DanhMuc/GetByMaGiaTri/THUONG-LAI`);
            if (res.data) setDanhMucVaiTro(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh mục vai trò:", err);
        }
    };

    // Lấy danh sách người mua (có phân trang)
    const fetchBuyers = useCallback(async () => {
        setLoading(true);
        try {
            // API này được ánh xạ từ bảng 'nguoi_dung' trong database 
            const res = await axiosInstance.get(
                `/api/NguoiDung/GetByMa/THUONG-LAI?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchTerm}`
            );

            if (res) {
                setBuyers(res.data || []);
                setTotal(res.totalRecords || 0);
            }
        } catch (err) {
            toast.error("Không thể tải danh sách người mua");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, searchTerm]);

    // Hook khởi tạo
    useEffect(() => {
        fetchRoleData();
    }, []);

    useEffect(() => {
        fetchBuyers();
    }, [fetchBuyers]);

    // --- 3. Định nghĩa Cấu trúc Bảng (Columns Definition) ---
    const columns: Column<NguoiDung>[] = [
        {
            header: "Tài khoản người mua",
            key: "hoTen",
            render: (user) => (
                <div className="flex items-center gap-3">
                    {user.anhDaiDienUrl ? (
                        <img
                            src={user.anhDaiDienUrl}
                            alt="Avatar"
                            className="size-10 rounded-full object-cover border border-gray-100"
                        />
                    ) : (
                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {user.hoTen?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-[#131613] dark:text-white leading-none">
                            {user.hoTen}
                        </h4>
                        <p className="text-[11px] text-[#6b806c] mt-1">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Địa điểm",
            key: "diaChi",
            render: (user) => <span className="text-sm">{user.diaChi || "Chưa cập nhật"}</span>
        },
        {
            header: "Ngày đăng ký",
            key: "ngayTao",
            render: (user) => (
                <span className="text-sm text-[#6b806c]">
                    {user.ngayTao
                        ? new Date(user.ngayTao).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })
                        : '---'}
                </span>
            )
        },
        {
            header: "Số dư ví",
            key: "soDu",
            className: "text-center",
            render: (user) => (
                <span className="text-sm font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.soDu)}
                </span>
            )
        },
        {
            header: "Trạng thái",
            key: "kichHoat",
            className: "text-center",
            render: (user) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.kichHoat
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {user.kichHoat ? 'Hoạt động' : 'Khóa'}
                </span>
            )
        },
        {
            header: "Hành động",
            key: "id",
            className: "text-right",
            render: (user) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-600 transition-colors"
                        title="Chỉnh sửa"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    // --- 4. Giao diện (Render) ---
    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-[#f8f9f8] dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Quản lý người mua"
                description="Theo dõi và quản lý tài khoản thương lái, doanh nghiệp thu mua nông sản."
                breadcrumbs={[
                    { label: 'Hệ thống', path: '/admin' },
                    { label: 'Người dùng', path: '/admin/users' },
                    { label: 'Người mua', isActive: true }
                ]}
                rightContent={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-all font-bold text-sm uppercase tracking-wider shadow-md"
                    >
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Thêm người mua
                    </button>
                }
            />

            <div className="flex flex-col mt-6 shadow-sm">
                {/* Thanh tìm kiếm & Bộ lọc */}
                <div className="bg-white dark:bg-[#1a261c] p-4 border border-[#dee3de] dark:border-gray-700 border-b-0 rounded-t-xl flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email hoặc địa chỉ..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#253326] border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                            Lọc trạng thái
                        </button>
                    </div>
                </div>

                {/* Bảng dữ liệu Generic */}
                <DataTable
                    data={buyers}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        pageNumber,
                        pageSize,
                        total,
                        onPageChange: (page) => setPageNumber(page)
                    }}
                    emptyMessage="Không tìm thấy dữ liệu người mua phù hợp với yêu cầu."
                />
            </div>

            {/* Tầng Modals (Tương tác nghiệp vụ) */}
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchBuyers}
                danhMucVaiTro={danhMucVaiTro}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
                onSuccess={fetchBuyers}
                user={selectedUser}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
                onSuccess={fetchBuyers}
                user={selectedUser}
            />
        </div>
    );
};

export default BuyerManagement;