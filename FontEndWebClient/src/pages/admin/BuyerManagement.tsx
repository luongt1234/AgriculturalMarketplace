import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../layouts/components/AdminHeader';
import type { NguoiDung } from '../../types/nguoiDung.type';
import { toast } from 'sonner';
import axiosInstance from '../../lip/axiosInstance';
import { AddUserModal } from '../../features/admin/components/AddUserModal';
import type { DanhMuc } from '../../types/danhMuc.type';

export const BuyerManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [buyers, setBuyers] = useState<NguoiDung[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [danhMucVaiTro, setDanhMucVaiTro] = useState<DanhMuc>();

    const fetchDataDanhMucVaiTroNguoiDung = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `/api/DanhMuc/GetByMaGiaTri/NONG_DAN`
            );

            console.log({ res });

            if (res.data) {
                setDanhMucVaiTro(res.data);
            }
        } catch (err: any) {
            console.log(`Lỗi khi lấy danh sách người bán ${err}`);
            toast.error(`Lỗi lấy danh sách người dùng`);
        } finally {
            setLoading(false);
        }
    }

    const fetchDataNguoiDung = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `/api/NguoiDung/GetByMa/NONG_DAN?pageNumber=${pageNumber}&pageSize=${pageSize}`
            );

            if (res.data && res.data.data) {
                setBuyers(res.data.data);
                setTotal(res.data.data.totalRecords);
            }
        } catch (err: any) {
            console.log(`Lỗi khi lấy danh sách người bán ${err}`);
            toast.error(`Lỗi lấy danh sách người dùng`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataNguoiDung();
        fetchDataDanhMucVaiTroNguoiDung();
    }, [])

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Quản lý người mua"
                description="Xem xét, xác minh và quản lý các tài khoản người mua trong lĩnh vực nông nghiệp."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Quản lý người mua', isActive: true }
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

                {/* Metric Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {mockMetrics.map((metric) => (
                        <div
                            key={metric.id}
                            className={`p-6 rounded-xl border shadow-sm ${metric.isDark
                                ? 'bg-[#131613] dark:bg-[#0a0f0a] border-[#253326]'
                                : 'bg-white dark:bg-[#1a261c] border-[#dee3de] dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold uppercase tracking-widest ${metric.isDark ? 'text-gray-400' : 'text-[#6b806c] dark:text-gray-400'
                                    }`}>
                                    {metric.title}
                                </span>
                                <span className="material-symbols-outlined text-primary text-xl">
                                    {metric.icon}
                                </span>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <h3 className={`text-2xl font-bold ${metric.isDark ? 'text-white' : 'text-[#131613] dark:text-white'
                                    }`}>
                                    {metric.value}
                                </h3>
                                <span className={`text-xs ${metric.hasTrendIcon ? 'font-bold flex items-center' : 'font-medium'
                                    } ${metric.subTextColor}`}>
                                    {metric.hasTrendIcon && (
                                        <span className="material-symbols-outlined text-[14px] mr-1">
                                            trending_up
                                        </span>
                                    )}
                                    {metric.subText}
                                </span>
                            </div>
                        </div>
                    ))}
                </div> */}

                {/* Search & Filter Controls */}
                <div className="bg-white dark:bg-[#1a261c] p-4 rounded-t-xl border border-[#dee3de] dark:border-gray-700 border-b-0 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#6b806c]">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none"
                                placeholder="Search by name, ID or email..."
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

                {/* Table Section */}
                <div className="bg-white dark:bg-[#1a261c] border border-[#dee3de] dark:border-gray-700 rounded-b-xl overflow-x-auto shadow-sm">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead className="bg-[#f9faf9] dark:bg-[#1f2d21] border-b border-[#dee3de] dark:border-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Tài khoản người mua</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Địa điểm</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400 text-center">Tổng số đơn hàng</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Ngày đăng ký</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400 text-center">Trạng thái</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f3f1] dark:divide-gray-700">
                            {buyers && buyers.length > 0 ? buyers.map((user, index) => (
                                <tr key={user.id} className="group hover:bg-[#f1f3f1]/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {user.anhDaiDienUrl ? (
                                                <div
                                                    className="size-10 rounded-full bg-center bg-cover border"
                                                    style={{ backgroundImage: `url(${user.anhDaiDienUrl})` }}
                                                />
                                            ) : (
                                                <div className="size-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 font-bold">
                                                    {user.hoTen?.charAt(0)}
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
                                    </td>

                                    {/* Địa chỉ */}
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-[#131613] dark:text-white">
                                            {user.diaChi || '---'}
                                        </span>
                                    </td>

                                    {/* Số dư */}
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-sm font-bold text-[#131613] dark:text-white">
                                            {user.soDu?.toLocaleString()} đ
                                        </span>
                                    </td>

                                    {/* Ngày tạo */}
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-[#6b806c] dark:text-gray-400">
                                            {user.ngayTao
                                                ? new Date(user.ngayTao).toLocaleDateString()
                                                : '---'}
                                        </span>
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="py-4 px-6 text-center">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.kichHoat
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                        >
                                            {user.kichHoat ? 'Hoạt động' : 'Khóa'}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 hover:text-primary">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:text-red-500">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <span className="material-symbols-outlined text-6xl text-[#dee3de] dark:text-gray-600">
                                                person_search
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-lg font-bold text-[#131613] dark:text-white">
                                                    Không tìm thấy người mua
                                                </h4>
                                                <p className="text-sm text-[#6b806c] dark:text-gray-400">
                                                    Hiện tại chưa có dữ liệu người mua nào được ghi nhận trong hệ thống.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="bg-[#f9faf9] dark:bg-[#1f2d21] px-6 py-4 border-t border-[#dee3de] dark:border-gray-700 flex items-center justify-between">
                        <p className="text-xs font-medium text-[#6b806c] dark:text-gray-400">Showing 1-3 of 12,482 buyer accounts</p>
                        <div className="flex items-center gap-1">
                            <button className="size-8 flex items-center justify-center rounded border border-[#dee3de] dark:border-gray-600 bg-white dark:bg-[#1a261c] text-[#6b806c] dark:text-gray-400 hover:text-[#131613] dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
                            <button className="size-8 flex items-center justify-center rounded border border-transparent text-[#6b806c] dark:text-gray-400 hover:bg-[#f1f3f1] dark:hover:bg-gray-700 font-medium text-xs">2</button>
                            <button className="size-8 flex items-center justify-center rounded border border-transparent text-[#6b806c] dark:text-gray-400 hover:bg-[#f1f3f1] dark:hover:bg-gray-700 font-medium text-xs">3</button>
                            <span className="px-1 text-[#6b806c] dark:text-gray-500 text-xs">...</span>
                            <button className="size-8 flex items-center justify-center rounded border border-transparent text-[#6b806c] dark:text-gray-400 hover:bg-[#f1f3f1] dark:hover:bg-gray-700 font-medium text-xs">416</button>
                            <button className="size-8 flex items-center justify-center rounded border border-[#dee3de] dark:border-gray-600 bg-white dark:bg-[#1a261c] text-[#6b806c] dark:text-gray-400 hover:text-[#131613] dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Insights Component */}
                {/* <div className="mt-8 bg-green-50 dark:bg-green-900/20 border-l-4 border-primary p-6 rounded-xl flex items-start gap-4 shadow-sm mb-6">
                    <div className="size-10 rounded-full bg-white dark:bg-[#1a261c] flex items-center justify-center text-primary shrink-0 border border-green-100 dark:border-green-800">
                        <span className="material-symbols-outlined icon-filled text-xl">auto_awesome</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#131613] dark:text-white">Estate Insights</h4>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1 leading-relaxed">
                            There has been a <span className="text-primary font-bold">22% surge</span> in buyer registrations from the Mediterranean region this week. Consider prioritizing verification for accounts matching these geolocation parameters to optimize marketplace liquidity.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#1a261c] border border-green-200 dark:border-green-800 text-primary text-xs font-bold hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors">View Queue</button>
                        <button className="px-4 py-2 rounded-lg text-[#6b806c] dark:text-gray-400 text-xs font-bold hover:text-[#131613] dark:hover:text-white transition-colors">Dismiss</button>
                    </div>
                </div> */}
            </div>

            {/* Modal */}
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDataNguoiDung}
                danhMucVaiTro={danhMucVaiTro}
            />
        </div>
    );
};

export default BuyerManagement;