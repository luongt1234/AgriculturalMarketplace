import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { getMyOrders, type DonHangDto, type ChiTietDonHangDto } from '../../features/orders/api/order.api';

const MONTHS = [
    { value: 0, label: 'Tất cả tháng' },
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' },
];

const COUNTED_STATUSES = ['ChoXuLy', 'XacNhan', 'DangGiao', 'DaGiao', 'HoanTat', 'ChoThanhToan'];
const COMPLETED_STATUSES = ['HoanTat', 'DaGiao'];

interface ProductStat {
    name: string;
    imageUrl: string | null;
    totalQty: number;
    totalSpent: number;
}

function fmt(n: number) {
    return n.toLocaleString('vi-VN') + ' ₫';
}

function normalizeOrdersResponse(res: Awaited<ReturnType<typeof getMyOrders>>): DonHangDto[] {
    return Array.isArray(res.data) ? res.data : [];
}

function StatCard({ icon, label, value, sub, color }: {
    icon: string; label: string; value: string; sub?: string; color: string;
}) {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex items-center gap-4`}>
            <div className={`p-3 rounded-xl ${color}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-xl font-black text-gray-900 dark:text-white truncate">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// Mini bar chart by month
function MonthlyBarChart({ data }: { data: { month: number; total: number }[] }) {
    const max = Math.max(...data.map(d => d.total), 1);
    return (
        <div className="flex items-end gap-1.5 h-24 w-full">
            {data.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative group">
                        <div
                            className="w-full bg-primary/80 hover:bg-primary rounded-t-sm transition-all duration-300"
                            style={{ height: `${Math.max((d.total / max) * 80, d.total > 0 ? 4 : 0)}px` }}
                        />
                        {d.total > 0 && (
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {fmt(d.total)}
                            </div>
                        )}
                    </div>
                    <span className="text-[9px] text-gray-400">{d.month}</span>
                </div>
            ))}
        </div>
    );
}

export const PurchaseStatisticsPage = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [allOrders, setAllOrders] = useState<DonHangDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all buyer orders for client-side aggregation.
    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageSize = 100;
            const firstPage = await getMyOrders({ pageNumber: 1, pageSize });
            const firstItems = normalizeOrdersResponse(firstPage);
            const totalRecords = firstPage.totalRecords ?? firstItems.length;
            const totalPages = Math.max(Math.ceil(totalRecords / pageSize), 1);

            if (totalPages === 1) {
                setAllOrders(firstItems);
                return;
            }

            const nextPages = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, index) =>
                    getMyOrders({ pageNumber: index + 2, pageSize })
                )
            );

            setAllOrders([
                ...firstItems,
                ...nextPages.flatMap(normalizeOrdersResponse),
            ]);
        } catch {
            setAllOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) fetchAll();
    }, [isAuthenticated, fetchAll]);

    // ── Filter orders by year + month ──────────────────────────────────────────
    const filtered = allOrders.filter(o => {
        const d = new Date(o.ngayTao);
        if (d.getFullYear() !== selectedYear) return false;
        if (selectedMonth !== 0 && d.getMonth() + 1 !== selectedMonth) return false;
        return COUNTED_STATUSES.includes(o.trangThai);
    });

    const completedOrders = filtered.filter(o => COMPLETED_STATUSES.includes(o.trangThai));

    // ── Aggregate stats ────────────────────────────────────────────────────────
    const totalSpent = filtered.reduce((s, o) => s + o.tongThanhToan, 0);
    const totalOrders = filtered.length;
    const totalItems = filtered.reduce((s, o) =>
        s + o.chiTiet.reduce((a, c) => a + c.soLuong, 0), 0);

    // Product breakdown
    const productMap: Record<string, ProductStat> = {};
    filtered.forEach(o => {
        o.chiTiet.forEach((item: ChiTietDonHangDto) => {
            const key = item.tenSanPham ?? item.sanPhamDangId;
            if (!productMap[key]) {
                productMap[key] = { name: key, imageUrl: item.hinhAnhUrl, totalQty: 0, totalSpent: 0 };
            }
            productMap[key].totalQty += item.soLuong;
            productMap[key].totalSpent += item.thanhTien;
        });
    });
    const productStats = Object.values(productMap).sort((a, b) => b.totalSpent - a.totalSpent);

    // Monthly breakdown (for chart, only when "all months" selected)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const orders = allOrders.filter(o => {
            const d = new Date(o.ngayTao);
            return d.getFullYear() === selectedYear
                && d.getMonth() + 1 === month
                && COUNTED_STATUSES.includes(o.trangThai);
        });
        return { month, total: orders.reduce((s, o) => s + o.tongThanhToan, 0) };
    });

    const availableYears = Array.from(
        new Set(allOrders.map(o => new Date(o.ngayTao).getFullYear()))
    ).sort((a, b) => b - a);
    if (!availableYears.includes(currentYear)) availableYears.unshift(currentYear);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background-dark">
                <BuyerHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">lock</span>
                        <p className="text-gray-500 mb-4 dark:text-gray-400">Vui lòng đăng nhập để xem thống kê</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-[#246328] transition font-semibold"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </div>
                <BuyerFooter />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background-dark">
            <BuyerHeader />

            <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 space-y-6">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <span className="material-symbols-outlined text-2xl">bar_chart</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Thống kê mua hàng</h1>
                            <p className="text-sm text-gray-400">Tổng hợp lịch sử chi tiêu của bạn</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(Number(e.target.value))}
                            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none font-medium"
                        >
                            {availableYears.map(y => (
                                <option key={y} value={y}>Năm {y}</option>
                            ))}
                        </select>
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(Number(e.target.value))}
                            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none font-medium"
                        >
                            {MONTHS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary">
                        <span className="material-symbols-outlined animate-spin text-5xl">progress_activity</span>
                        <span className="text-sm text-gray-400">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <>
                        {/* ── Summary Cards ───────────────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard
                                icon="payments"
                                label="Tổng chi tiêu"
                                value={fmt(totalSpent)}
                                sub={selectedMonth ? MONTHS[selectedMonth].label : `Năm ${selectedYear}`}
                                color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            />
                            <StatCard
                                icon="receipt_long"
                                label="Số đơn hàng"
                                value={`${totalOrders} đơn`}
                                sub={`${completedOrders.length} đơn hoàn thành`}
                                color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            />
                            <StatCard
                                icon="inventory_2"
                                label="Sản phẩm đã mua"
                                value={`${totalItems} món`}
                                sub={`${productStats.length} loại sản phẩm`}
                                color="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                            />
                        </div>

                        {/* ── Monthly Chart (only when viewing full year) ── */}
                        {selectedMonth === 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-primary">show_chart</span>
                                        Chi tiêu theo tháng — {selectedYear}
                                    </h2>
                                </div>
                                <MonthlyBarChart data={monthlyData} />
                                <div className="flex justify-between mt-1 px-0.5">
                                    {monthlyData.map(d => (
                                        <span key={d.month} className="flex-1 text-center text-[9px] text-gray-300" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Product Breakdown ────────────────────────────── */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
                                    Sản phẩm đã mua
                                    {selectedMonth > 0 && (
                                        <span className="text-xs font-normal text-gray-400">
                                            — {MONTHS[selectedMonth].label}
                                        </span>
                                    )}
                                </h2>
                                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
                                    {productStats.length} loại
                                </span>
                            </div>

                            {productStats.length === 0 ? (
                                <div className="py-16 text-center">
                                    <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-gray-700 block mb-3">
                                        shopping_bag
                                    </span>
                                    <p className="text-gray-400 text-sm">
                                        Không có dữ liệu trong{' '}
                                        {selectedMonth > 0 ? MONTHS[selectedMonth].label : `năm ${selectedYear}`}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {/* Table header */}
                                    <div className="hidden sm:grid grid-cols-12 px-5 py-2.5 text-xs text-gray-400 uppercase tracking-wide font-semibold bg-gray-50 dark:bg-gray-800/50">
                                        <span className="col-span-6">Sản phẩm</span>
                                        <span className="col-span-2 text-center">Số lượng</span>
                                        <span className="col-span-2 text-right">Thành tiền</span>
                                        <span className="col-span-2 text-right">% chi tiêu</span>
                                    </div>

                                    {productStats.map((p, idx) => {
                                        const pct = totalSpent > 0 ? ((p.totalSpent / totalSpent) * 100).toFixed(1) : '0';
                                        return (
                                            <div
                                                key={p.name}
                                                className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors gap-2"
                                            >
                                                {/* Rank + name */}
                                                <div className="col-span-12 sm:col-span-6 flex items-center gap-3 min-w-0">
                                                    <span className={`text-xs font-black w-5 text-center shrink-0 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div
                                                        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-600"
                                                        style={p.imageUrl ? { backgroundImage: `url('http://localhost:5182${p.imageUrl}')` } : {}}
                                                    />
                                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                                                </div>

                                                {/* Qty */}
                                                <div className="col-span-4 sm:col-span-2 flex sm:justify-center items-center gap-1">
                                                    <span className="text-xs text-gray-400 sm:hidden">SL:</span>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">×{p.totalQty}</span>
                                                </div>

                                                {/* Total */}
                                                <div className="col-span-4 sm:col-span-2 text-right">
                                                    <span className="text-sm font-bold text-primary">{fmt(p.totalSpent)}</span>
                                                </div>

                                                {/* Pct bar */}
                                                <div className="col-span-4 sm:col-span-2 flex flex-col items-end gap-1">
                                                    <span className="text-xs font-semibold text-gray-500">{pct}%</span>
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                                        <div
                                                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Footer total */}
                            {productStats.length > 0 && (
                                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-500">Tổng chi tiêu</span>
                                    <span className="text-xl font-black text-primary">{fmt(totalSpent)}</span>
                                </div>
                            )}
                        </div>

                        {/* ── Quick links ──────────────────────────────────── */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/orders')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                                Xem đơn hàng
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#246328] transition-colors"
                            >
                                <span className="material-symbols-outlined text-[17px]">storefront</span>
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </>
                )}
            </main>

            <BuyerFooter />
        </div>
    );
};

export default PurchaseStatisticsPage;
