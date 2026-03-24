import React from 'react';
import { AdminHeader } from '../../layouts/components/AdminHeader';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white dark:bg-[#131613]">
            <AdminHeader
                title="Tổng quan"
                description="Hiệu suất nền tảng ngày 24 tháng 10, 2023"
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/admin' },
                    { label: 'Hệ thống', path: '/admin' },
                    { label: 'Tổng quan', isActive: true }
                ]}
                rightContent={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a261c] border border-[#dee3de] dark:border-gray-700 text-[#131613] dark:text-white rounded-lg text-sm font-semibold hover:bg-[#f1f3f1] dark:hover:bg-white/5 shadow-sm transition-all">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Xuất báo cáo
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-[#246328] shadow-sm transition-all uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                            Làm mới
                        </button>
                    </>
                }
            />

            <div className="max-w-[1920px] mx-auto flex flex-col gap-6 mt-6">
                {/* 4 Thẻ chỉ số chính (KPI Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Card 1: Tổng GMV */}
                    <div className="bg-white dark:bg-[#1a261c] p-5 rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors group h-32 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-primary">attach_money</span>
                        </div>
                        <div className="flex justify-between items-start z-10">
                            <div>
                                <p className="text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-widest">Tổng GMV</p>
                                <h3 className="text-2xl font-bold text-[#131613] dark:text-white mt-1 tracking-tight">4.250.000đ</h3>
                            </div>
                            <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                                <span className="material-symbols-outlined text-xl">payments</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-auto z-10">
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>
                                12.5%
                            </span>
                            <span className="text-xs text-[#6b806c] dark:text-gray-500">so với tháng trước</span>
                        </div>
                    </div>

                    {/* Card 2: Doanh thu thuần */}
                    <div className="bg-white dark:bg-[#1a261c] p-5 rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-colors group h-32 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-blue-600">percent</span>
                        </div>
                        <div className="flex justify-between items-start z-10">
                            <div>
                                <p className="text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-widest">Doanh thu thuần</p>
                                <h3 className="text-2xl font-bold text-[#131613] dark:text-white mt-1 tracking-tight">340.000đ</h3>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-md text-blue-600">
                                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-auto z-10">
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>
                                8.2%
                            </span>
                            <span className="text-xs text-[#6b806c] dark:text-gray-500">so với tháng trước</span>
                        </div>
                    </div>

                    {/* Card 3: Người bán đang hoạt động */}
                    <div className="bg-white dark:bg-[#1a261c] p-5 rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col justify-between hover:border-orange-400 transition-colors group h-32 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-orange-600">storefront</span>
                        </div>
                        <div className="flex justify-between items-start z-10">
                            <div>
                                <p className="text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-widest">Người bán hoạt động</p>
                                <h3 className="text-2xl font-bold text-[#131613] dark:text-white mt-1 tracking-tight">1,240</h3>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-md text-orange-600">
                                <span className="material-symbols-outlined text-xl">store</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-auto z-10">
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>
                                5.0%
                            </span>
                            <span className="text-xs text-[#6b806c] dark:text-gray-500">85 đang online</span>
                        </div>
                    </div>

                    {/* Card 4: Người dùng mới */}
                    <div className="bg-[#131613] dark:bg-[#0a0f0a] p-5 rounded-xl border border-[#253326] shadow-sm flex flex-col justify-between group h-32 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">person_add</span>
                        </div>
                        <div className="flex justify-between items-start z-10">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Người dùng mới</p>
                                <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">35</h3>
                            </div>
                            <div className="bg-white/10 p-1.5 rounded-md text-white">
                                <span className="material-symbols-outlined text-xl">group_add</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-auto z-10">
                            <span className="flex items-center text-xs font-bold text-[#131613] bg-white px-1.5 py-0.5 rounded shadow-sm">
                                Hôm nay
                            </span>
                            <span className="text-xs text-gray-400">+12 từ sáng</span>
                        </div>
                    </div>
                </div>

                {/* Khu vực Biểu đồ bản đồ & Bảng xếp hạng */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                    <div className="lg:col-span-8 bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col overflow-hidden relative group">
                        <div className="p-4 border-b border-[#f1f3f1] dark:border-gray-700 flex items-center justify-between bg-white dark:bg-[#1a261c] z-10">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-[#131613] dark:text-white uppercase tracking-wider">Mật độ đơn hàng theo khu vực</h2>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-green-50 dark:bg-green-900/20 text-primary font-bold border border-green-100 dark:border-green-900/30 shadow-sm flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Trực tiếp
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <select className="text-xs border-[#dee3de] dark:border-gray-600 rounded py-1 pl-2 pr-6 bg-white dark:bg-[#253326] text-[#131613] dark:text-white focus:ring-primary">
                                    <option>Việt Nam</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#f9faf9] dark:bg-[#1f2d21] relative w-full h-full flex items-center justify-center">
                            <div className="text-[#6b806c] dark:text-gray-500 italic">Khu vực hiển thị bản đồ</div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                        <div className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-[#f1f3f1] dark:border-gray-700">
                                <h3 className="text-sm font-bold text-[#131613] dark:text-white uppercase tracking-wider">Tỉnh thành nổi bật</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#f9faf9] dark:bg-[#1f2d21] sticky top-0 z-10 text-[10px] uppercase text-[#6b806c] dark:text-gray-400 font-bold border-b border-[#dee3de] dark:border-gray-700">
                                        <tr>
                                            <th className="px-4 py-3">Khu vực</th>
                                            <th className="px-4 py-3 text-right">Doanh thu</th>
                                            <th className="px-4 py-3 text-right">Xu hướng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f1f3f1] dark:divide-gray-700 text-sm">
                                        <tr className="hover:bg-[#f1f3f1]/50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f1f3f1] dark:bg-[#253326] border border-[#dee3de] dark:border-gray-600 text-[#131613] dark:text-white text-[10px] font-bold shadow-sm">1</span>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#131613] dark:text-white group-hover:text-primary transition-colors">Hồ Chí Minh</span>
                                                        <span className="text-[10px] text-[#6b806c]">Miền Nam</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-[#131613] dark:text-white">1.2 Tỷ</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-[10px] font-bold text-primary bg-white dark:bg-[#1a261c] border border-green-100 dark:border-green-900/30 px-1.5 py-0.5 rounded-full shadow-sm">+14%</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-3 border-t border-[#f1f3f1] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                                <button className="w-full py-2 text-xs font-bold text-primary border border-primary/20 bg-white dark:bg-[#1a261c] rounded-lg hover:bg-[#f1f3f1] dark:hover:bg-white/5 transition-all uppercase tracking-widest shadow-sm">Xem Báo cáo Đầy đủ</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Khối System Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
                    <div className="bg-white dark:bg-[#1a261c] px-5 py-4 rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-primary ring-4 ring-green-50/50 dark:ring-green-900/10">
                                <span className="material-symbols-outlined text-xl">dns</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wider">Hệ thống hoạt động</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-[#131613] dark:text-white">99.99%</span>
                                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-primary bg-white dark:bg-[#1a261c] border border-green-100 dark:border-green-900/30 px-2 py-0.5 rounded shadow-sm">Ổn định</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a261c] px-5 py-4 rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wider">Độ trễ API</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-[#131613] dark:text-white">45ms</span>
                                    <span className="text-[10px] text-[#6b806c]">avg</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-8 w-32 opacity-50">
                            {/* Mini chart placeholder */}
                            <span className="material-symbols-outlined text-primary text-3xl">show_chart</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a261c] px-5 py-4 rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wider">Tải Database</span>
                                <span className="text-xs font-bold text-[#131613] dark:text-white">32%</span>
                            </div>
                            <div className="w-full bg-[#f1f3f1] dark:bg-[#253326] rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: '32%' }}></div>
                            </div>
                        </div>
                        <div className="pl-4 border-l border-[#dee3de] dark:border-gray-700">
                            <p className="text-[10px] text-[#6b806c] whitespace-nowrap">Kết nối</p>
                            <p className="text-sm font-bold text-[#131613] dark:text-white">1,204</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;