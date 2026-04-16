import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { getMyOrders, type DonHangDto } from '../../features/orders/api/order.api';

const TABS = [
    { key: '', label: 'Tất cả' },
    { key: 'ChoXuLy', label: 'Chờ xử lý' },
    { key: 'XacNhan', label: 'Đã xác nhận' },
    { key: 'DangGiao', label: 'Đang giao' },
    { key: 'HoanTat', label: 'Hoàn tất' },
    { key: 'Huy', label: 'Đã hủy' },
];

const STATUS_STYLES: Record<string, string> = {
    ChoXuLy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    XacNhan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    DangGiao: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    HoanTat: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Huy: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const OrdersPage = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('');
    const [orders, setOrders] = useState<DonHangDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getMyOrders({
                pageNumber: currentPage,
                pageSize: PAGE_SIZE,
                trangThai: activeTab || undefined,
            });
            setOrders(res.data ?? []);
            setTotalRecords(res.totalRecords ?? 0);
        } catch (err) {
            console.error('Lỗi khi tải đơn hàng:', err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    // Reset page khi đổi tab
    const handleTabChange = (key: string) => {
        setActiveTab(key);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 mb-4 dark:text-gray-400">Vui lòng đăng nhập để xem đơn hàng</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition font-semibold"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background-dark">
            <BuyerHeader />

            <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                        Đơn hàng của tôi
                    </h1>
                    <span className="text-sm text-gray-500">{totalRecords} đơn hàng</span>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                    <div className="flex overflow-x-auto">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`flex-1 min-w-[120px] py-4 px-2 text-center text-sm font-medium transition-colors whitespace-nowrap
                                    ${activeTab === tab.key
                                        ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-500 text-sm">Đang tải đơn hàng...</p>
                            </div>
                        </div>
                    ) : orders.length > 0 ? (
                        <>
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50 dark:bg-gray-900/50">
                                        <div className="flex items-center gap-3">
                                            {order.anhDaiDienNguoiBan && (
                                                <img
                                                    src={`http://localhost:5000${order.anhDaiDienNguoiBan}`}
                                                    alt={order.tenNguoiBan ?? ''}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                />
                                            )}
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {order.tenNguoiBan ?? 'Người bán'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-gray-500">
                                                {new Date(order.ngayTao).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className={`font-semibold px-2.5 py-1 rounded-full text-xs ${STATUS_STYLES[order.trangThai] ?? ''}`}>
                                                {order.trangThaiLabel ?? order.trangThai}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4 space-y-4">
                                        {order.chiTiet.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div
                                                    className="w-20 h-20 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 bg-cover bg-center flex-shrink-0"
                                                    style={{
                                                        backgroundImage: `url(${item.hinhAnhUrl
                                                            ? 'http://localhost:5000' + item.hinhAnhUrl
                                                            : 'https://placehold.co/80x80?text=SP'
                                                        })`
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                                                        {item.tenSanPham ?? 'Sản phẩm'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">x{item.soLuong}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {item.thanhTien.toLocaleString('vi-VN')}₫
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {item.donGia.toLocaleString('vi-VN')}₫/sp
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-gray-500 text-sm">
                                            Mã: <span className="font-medium text-gray-900 dark:text-white">{order.id.slice(0, 8).toUpperCase()}</span>
                                        </p>
                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Tổng thanh toán</p>
                                                <p className="text-xl font-bold text-primary">
                                                    {order.tongThanhToan.toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/shop/${order.nguoiBanId}`)}
                                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg text-sm transition-colors whitespace-nowrap"
                                                >
                                                    Xem shop
                                                </button>
                                                {order.trangThai === 'HoanTat' && (
                                                    <button className="px-4 py-2 bg-primary text-white hover:bg-primary-dark font-semibold rounded-lg text-sm transition-colors whitespace-nowrap">
                                                        Đánh giá
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 pt-4">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                                    >
                                        ← Trước
                                    </button>
                                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-16 text-center rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">inventory_2</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có đơn hàng nào</h3>
                            <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong trạng thái này.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <BuyerFooter />
        </div>
    );
};

export default OrdersPage;
