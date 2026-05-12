import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { getMyOrders, buyerXacNhanDaNhan, type DonHangDto, type ChiTietDonHangDto } from '../../features/orders/api/order.api';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_TABS = [
    { key: '', label: 'Tất cả', icon: 'list_alt' },
    { key: 'ChoXuLy', label: 'Chờ xử lý', icon: 'pending', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700' },
    { key: 'XacNhan', label: 'Đã xác nhận', icon: 'check_circle', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' },
    { key: 'DangGiao', label: 'Đang giao', icon: 'local_shipping', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-700' },
    { key: 'DaGiao', label: 'Đã giao', icon: 'inventory_2', color: 'text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-700' },
    { key: 'HoanTat', label: 'Hoàn tất', icon: 'task_alt', color: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' },
    { key: 'Huy', label: 'Đã hủy', icon: 'cancel', color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700' },
];

function getStatusCfg(key: string) {
    return STATUS_TABS.find(s => s.key === key) ?? {
        label: key, icon: 'help',
        color: 'text-gray-600 bg-gray-50 border-gray-200',
    };
}

function StatusBadge({ status, label }: { status: string; label?: string | null }) {
    const cfg = getStatusCfg(status);
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
            <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
            {label ?? cfg.label}
        </span>
    );
}

function parseAddress(raw: string | null): string {
    if (!raw) return 'Không có địa chỉ';
    try {
        const obj = JSON.parse(raw);
        return [obj.diaChiChiTiet, obj.wardName, obj.districtName, obj.provinceName]
            .filter(Boolean).join(', ') || raw;
    } catch { return raw; }
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function OrderDetailModal({
    order,
    onClose,
    onConfirmReceived,
}: {
    order: DonHangDto;
    onClose: () => void;
    onConfirmReceived: (id: string) => Promise<void>;
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fmt = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
    const fmtDate = (s: string) =>
        new Date(s).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirmReceived(order.id);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chi tiết đơn hàng</h2>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.trangThai} label={order.trangThaiLabel} />
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Seller info */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        {order.anhDaiDienNguoiBan ? (
                            <img
                                src={`http://localhost:5182${order.anhDaiDienNguoiBan}`}
                                alt={order.tenNguoiBan ?? ''}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{order.tenNguoiBan ?? 'Người bán'}</p>
                            <p className="text-xs text-gray-400">{fmtDate(order.ngayTao)}</p>
                        </div>
                        <button
                            onClick={() => { onClose(); navigate(`/shop/${order.nguoiBanId}`); }}
                            className="text-xs text-primary font-semibold hover:underline"
                        >
                            Xem shop →
                        </button>
                    </div>

                    {/* Address */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Địa chỉ giao hàng</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                            {parseAddress(order.diaChiGiaoHang)}
                        </p>
                    </div>

                    {order.ghiChu && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0">note</span>
                            <p className="text-sm text-amber-800 dark:text-amber-200">{order.ghiChu}</p>
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Sản phẩm đã đặt</h3>
                        <div className="space-y-3">
                            {order.chiTiet.map((item: ChiTietDonHangDto) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div
                                        className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-600"
                                        style={{
                                            backgroundImage: item.hinhAnhUrl
                                                ? `url('http://localhost:5182${item.hinhAnhUrl}')`
                                                : undefined,
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                            {item.tenSanPham ?? 'Sản phẩm'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {item.soLuong} × {fmt(item.donGia)}
                                        </p>
                                    </div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white shrink-0">
                                        {fmt(item.thanhTien)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Tiền hàng</span>
                            <span>{fmt(order.tongTien)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Phí vận chuyển</span>
                            <span>{fmt(order.phiVanChuyen)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-1 border-t border-dashed border-gray-200 dark:border-gray-600">
                            <span>Tổng thanh toán</span>
                            <span className="text-primary">{fmt(order.tongThanhToan)}</span>
                        </div>
                    </div>

                    {/* Action: confirm received */}
                    {(order.trangThai === 'DaGiao' || order.trangThai === 'DangGiao') && (
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-[#246328] text-white font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">task_alt</span>
                            {loading ? 'Đang xử lý...' : 'Xác nhận đã nhận hàng'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({
    order,
    onSelect,
    onConfirmReceived,
}: {
    order: DonHangDto;
    onSelect: () => void;
    onConfirmReceived: (id: string) => Promise<void>;
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fmt = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

    const handleConfirm = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        await onConfirmReceived(order.id);
        setLoading(false);
    };

    return (
        <div
            onClick={onSelect}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
        >
            {/* Card header: seller */}
            <div className="px-5 py-3.5 bg-gray-50/70 dark:bg-gray-800/70 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    {order.anhDaiDienNguoiBan ? (
                        <img
                            src={`http://localhost:5182${order.anhDaiDienNguoiBan}`}
                            alt={order.tenNguoiBan ?? ''}
                            className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                        />
                    ) : (
                        <span className="material-symbols-outlined text-[20px] text-gray-400">storefront</span>
                    )}
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
                        {order.tenNguoiBan ?? 'Người bán'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                        {new Date(order.ngayTao).toLocaleDateString('vi-VN')}
                    </span>
                    <StatusBadge status={order.trangThai} label={order.trangThaiLabel} />
                </div>
            </div>

            {/* Items preview */}
            <div className="px-5 py-4 space-y-3">
                {order.chiTiet.slice(0, 2).map((item: ChiTietDonHangDto) => (
                    <div key={item.id} className="flex gap-3">
                        <div
                            className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-600"
                            style={{
                                backgroundImage: item.hinhAnhUrl
                                    ? `url('http://localhost:5182${item.hinhAnhUrl}')`
                                    : undefined,
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                                {item.tenSanPham ?? 'Sản phẩm'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">x{item.soLuong}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                {fmt(item.thanhTien)}
                            </p>
                            <p className="text-xs text-gray-400">{fmt(item.donGia)}/sp</p>
                        </div>
                    </div>
                ))}
                {order.chiTiet.length > 2 && (
                    <p className="text-xs text-gray-400 text-center">
                        + {order.chiTiet.length - 2} sản phẩm khác
                    </p>
                )}
            </div>

            {/* Card footer */}
            <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400">Tổng thanh toán</p>
                    <p className="text-lg font-black text-primary">{fmt(order.tongThanhToan)}</p>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => navigate(`/shop/${order.nguoiBanId}`)}
                        className="px-3.5 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl text-xs transition-colors"
                    >
                        Xem shop
                    </button>

                    {(order.trangThai === 'DaGiao' || order.trangThai === 'DangGiao') && (
                        <button
                            disabled={loading}
                            onClick={handleConfirm}
                            className="px-3.5 py-2 bg-primary hover:bg-[#246328] text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[14px]">task_alt</span>
                            {loading ? '...' : 'Đã nhận hàng'}
                        </button>
                    )}

                    {order.trangThai === 'HoanTat' && (
                        <button className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 border border-amber-200 dark:border-amber-700">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            Đánh giá
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export const OrdersPage = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('');
    const [orders, setOrders] = useState<DonHangDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<DonHangDto | null>(null);
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
        } catch {
            toast.error('Không thể tải danh sách đơn hàng');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        if (isAuthenticated) fetchOrders();
    }, [isAuthenticated, fetchOrders]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        setCurrentPage(1);
    };

    const handleConfirmReceived = async (id: string) => {
        const toastId = toast.loading('Đang xác nhận...');
        try {
            await buyerXacNhanDaNhan(id);
            toast.success('Xác nhận nhận hàng thành công!', { id: toastId });
            setSelectedOrder(null);
            fetchOrders();
        } catch {
            toast.error('Có lỗi xảy ra, vui lòng thử lại', { id: toastId });
        }
    };

    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background-dark">
                <BuyerHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">lock</span>
                        <p className="text-gray-500 mb-4 dark:text-gray-400">Vui lòng đăng nhập để xem đơn hàng</p>
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

            <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 sm:px-6">
                {/* Page title */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                        Đơn hàng của tôi
                    </h1>
                    <span className="text-sm text-gray-400">{totalRecords} đơn hàng</span>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-primary">
                        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                        <span className="text-sm text-gray-400">Đang tải đơn hàng...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-600 block mb-3">
                            inventory_2
                        </span>
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Chưa có đơn hàng nào
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Bạn chưa có đơn hàng nào trong trạng thái này.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-[#246328] transition-colors"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onSelect={() => setSelectedOrder(order)}
                                    onConfirmReceived={handleConfirmReceived}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3.5 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${p === currentPage
                                                ? 'bg-primary text-white border-primary'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3.5 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <BuyerFooter />

            {/* Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onConfirmReceived={handleConfirmReceived}
                />
            )}
        </div>
    );
};

export default OrdersPage;
