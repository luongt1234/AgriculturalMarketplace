import React, { useEffect, useState, useMemo } from 'react';
import { AdminHeader } from '../../layouts/components/AdminHeader';
import { toast } from 'sonner';
import { DataTable, type Column } from '../../components/common/DataTable';
import type { DanhMuc, LoaiDanhMuc } from '../../types/danhMuc.type';
import axiosInstance from '../../lip/axiosInstance';
import { AddCategoryModal } from '../../features/admin/components/category/AddCategoryModal';
import { EditCategoryModal } from '../../features/admin/components/category/EditCategoryModal';
import { DeleteCategoryModal } from '../../features/admin/components/category/DeleteCategoryModal';

type TabType = 'LOAI_DANH_MUC' | 'DANH_MUC';

const CategoryManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('LOAI_DANH_MUC');

    // State dữ liệu
    const [loaiDanhMucs, setLoaiDanhMucs] = useState<LoaiDanhMuc[]>([]);
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);

    // State phân trang & loading
    const [loading, setLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    // State Modals
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    // Selected Item có thể là LoaiDanhMuc hoặc DanhMuc
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Fetch dữ liệu tùy theo Tab hiện tại
    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'LOAI_DANH_MUC') {
                const res = await axiosInstance.get(
                    `/api/LoaiDanhMuc/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
                );
                if (res) {
                    setLoaiDanhMucs(res.data || []);
                    setTotal(res.totalRecords || 0);
                }
            } else {
                const res = await axiosInstance.get(
                    `/api/DanhMuc/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
                );
                if (res) {
                    setDanhMucs(res.data || []);
                    setTotal(res.totalRecords || 0);
                }
            }
        } catch (err: any) {
            console.log(`Lỗi khi lấy dữ liệu: ${err}`);
            toast.error(`Lỗi tải dữ liệu ${activeTab === 'LOAI_DANH_MUC' ? 'Loại danh mục' : 'Danh mục'}`);
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API khi đổi Tab, Page, PageSize
    useEffect(() => {
        fetchData();
    }, [activeTab, pageNumber, pageSize]);

    // Khi đổi tab, reset lại trang về 1
    const handleTabChange = (tab: TabType) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setPageNumber(1);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage);
    };

    // Mở modal Edit chung
    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    // Mở modal Delete chung
    const handleDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    // ==========================================
    // ĐỊNH NGHĨA CỘT CHO TAB "LOẠI DANH MỤC"
    // ==========================================
    const loaiDanhMucColumns = useMemo<Column<LoaiDanhMuc>[]>(() => [
        {
            header: 'Mã Loại',
            key: 'maLoaiDanhMuc',
            className: 'font-semibold',
            render: (item) => <span className="text-[#131613] dark:text-white">{item.maLoaiDanhMuc}</span>
        },
        {
            header: 'Tên Loại Danh Mục',
            key: 'tenLoaiDanhMuc',
            render: (item) => <span className="text-[#131613] dark:text-white">{item.tenLoaiDanhMuc}</span>
        },
        {
            header: 'Hành động',
            key: 'action',
            className: 'text-right',
            render: (item) => (
                <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:text-primary transition-colors" onClick={() => handleEdit(item)} title="Chỉnh sửa">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="p-1.5 hover:text-red-500 transition-colors" onClick={() => handleDelete(item)} title="Xóa">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            )
        }
    ], []);

    // ==========================================
    // ĐỊNH NGHĨA CỘT CHO TAB "DANH MỤC"
    // ==========================================
    const danhMucColumns = useMemo<Column<DanhMuc>[]>(() => [
        {
            header: 'Mã Giá Trị',
            key: 'maGiaTri',
            className: 'font-semibold text-primary',
        },
        {
            header: 'Tên Hiển Thị',
            key: 'tenHienThi',
            render: (item) => <span className="text-[#131613] dark:text-white font-medium">{item.tenHienThi}</span>
        },
        {
            header: 'Loại Danh Mục',
            key: 'loaiDanhMucId',
            // Nếu BE trả về object LoaiDanhMuc, bạn hiển thị tên. Nếu không thì hiển thị ID hoặc xử lý map dữ liệu
            render: (item) => <span className="text-sm">{item.loaiDanhMuc?.tenLoaiDanhMuc || '---'}</span>
        },
        {
            header: 'Thứ tự',
            key: 'thuTu',
            className: 'text-center',
            render: (item) => <span className="inline-flex px-2 py-1 bg-gray-100 rounded text-xs">{item.thuTu}</span>
        },
        {
            header: 'Danh mục cấp trên',
            key: 'danhMucCapTrenId',
            render: (item) => <span className="text-sm text-gray-500">{item.danhMucCapTren?.tenHienThi || 'Root (Không có)'}</span>
        },
        {
            header: 'Hành động',
            key: 'action',
            className: 'text-right',
            render: (item) => (
                <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:text-primary transition-colors" onClick={() => handleEdit(item)} title="Chỉnh sửa">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="p-1.5 hover:text-red-500 transition-colors" onClick={() => handleDelete(item)} title="Xóa">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Quản lý Danh mục"
                description="Quản lý cấu trúc phân loại sản phẩm, vai trò và các danh mục hệ thống."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Quản lý danh mục', isActive: true }
                ]}
                rightContent={
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#246328] text-white transition-all font-bold text-sm uppercase tracking-widest shadow-sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="material-symbols-outlined icon-filled text-[18px]">add_circle</span>
                        {activeTab === 'LOAI_DANH_MUC' ? 'Thêm Loại' : 'Thêm Danh Mục'}
                    </button>
                }
            />

            <div className="flex flex-col">
                {/* Search & Filter Controls (Cùng bar chứa Tab) */}
                <div className="bg-white dark:bg-[#1a261c] p-4 rounded-t-xl border border-[#dee3de] dark:border-gray-700 border-b-0 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">

                        {/* Tab Switcher */}
                        <div className="flex bg-[#f1f3f1] dark:bg-[#253326] p-1 rounded-lg">
                            <button
                                onClick={() => handleTabChange('LOAI_DANH_MUC')}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'LOAI_DANH_MUC'
                                    ? 'bg-white dark:bg-[#1a261c] text-primary shadow-sm border border-[#dee3de] dark:border-gray-700'
                                    : 'text-[#6b806c] dark:text-gray-400 hover:text-[#131613] dark:hover:text-white'
                                    }`}
                            >
                                Loại Danh Mục
                            </button>
                            <button
                                onClick={() => handleTabChange('DANH_MUC')}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'DANH_MUC'
                                    ? 'bg-white dark:bg-[#1a261c] text-primary shadow-sm border border-[#dee3de] dark:border-gray-700'
                                    : 'text-[#6b806c] dark:text-gray-400 hover:text-[#131613] dark:hover:text-white'
                                    }`}
                            >
                                Danh Mục Chi Tiết
                            </button>
                        </div>

                        <div className="h-10 w-px bg-[#dee3de] dark:bg-gray-700 mx-1"></div>

                        {/* Search Bar */}
                        <div className="relative w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#6b806c] text-[20px]">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none"
                                placeholder="Tìm kiếm mã hoặc tên..."
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                {/* Render DataTable động dựa trên Active Tab */}
                {activeTab === 'LOAI_DANH_MUC' ? (
                    <DataTable
                        data={loaiDanhMucs}
                        columns={loaiDanhMucColumns}
                        loading={loading}
                        pagination={{
                            pageNumber,
                            pageSize,
                            total,
                            onPageChange: handlePageChange
                        }}
                        emptyMessage="Hiện tại chưa có Loại danh mục nào trong hệ thống."
                    />
                ) : (
                    <DataTable
                        data={danhMucs}
                        columns={danhMucColumns}
                        loading={loading}
                        pagination={{
                            pageNumber,
                            pageSize,
                            total,
                            onPageChange: handlePageChange
                        }}
                        emptyMessage="Hiện tại chưa có Danh mục chi tiết nào trong hệ thống."
                    />
                )}
            </div>

            {/* Modals */}
            <AddCategoryModal
                type={activeTab}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchData();
                    setSelectedItem(null);
                }}
            />
            <EditCategoryModal
                type={activeTab}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                item={selectedItem}
                onSuccess={() => {
                    fetchData();
                    setSelectedItem(null);
                }}
            />
            <DeleteCategoryModal
                type={activeTab}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                item={selectedItem}
                onSuccess={() => {
                    fetchData();
                    setSelectedItem(null);
                }}
            />
        </div>
    );
};

export default CategoryManagement;