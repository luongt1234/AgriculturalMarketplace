import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import {
    getSellerOrders,
    sellerXacNhan,
    sellerTuChoi,
    sellerGiaoHang,
} from '../../features/checkout/api/order.api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChiTietDonHang {
    id: string;
    sanPhamDangId: string;
    tenSanPham: string;
    hinhAnhUrl: string;
    soLuong: number;
    donGia: number;
    thanhTien: number;
}

interface DonHang {
    id: string;
    ngayTao: string;
    nguoiMuaId: string;
    nguoiBanId: string;
    tenNguoiBan: string;
    tongTien: number;
    phiVanChuyen: number;
    tongThanhToan: number;
    trangThai: string;
    trangThaiLabel: string;
    diaChiGiaoHang: string | null;
    ghiChu: string | null;
    chiTiet: ChiTietDonHang[];
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_TABS = [
    { key: '', label: 'Tất cả', icon: 'list_alt' },
    { key: 'ChoXuLy', label: 'Chờ xử lý', icon: 'pending', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { key: 'XacNhan', label: 'Đã xác nhận', icon: 'check_circle', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { key: 'DangGiao', label: 'Đang giao', icon: 'local_shipping', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { key: 'DaGiao', label: 'Đã giao', icon: 'inventory_2', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { key: 'HoanTat', label: 'Hoàn tất', icon: 'task_alt', color: 'text-green-700 bg-green-50 border-green-200' },
    { key: 'Huy', label: 'Đã hủy', icon: 'cancel', color: 'text-red-600 bg-red-50 border-red-200' },
];

function getStatusConfig(key: string) {
    return STATUS_TABS.find(s => s.key === key) ?? { label: key, icon: 'help', color: 'text-gray-600 bg-gray-50 border-gray-200' };
}

function StatusBadge({ status }: { status: string }) {
    const cfg = getStatusConfig(status);
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
            <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
            {cfg.label || status}
        </span>
    );
}

// ── Address parser ────────────────────────────────────────────────────────────
function parseAddress(raw: string | null): string {
    if (!raw) return 'Không có';
    try {
        const obj = JSON.parse(raw);
        const parts = [
            obj.diaChiChiTiet,
            obj.wardName,
            obj.districtName,
            obj.provinceName,
        ].filter(Boolean);
        return parts.join(', ') || raw;
    } catch {
        return raw;
    }
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({
    order,
    onClose,
    onAction,
}: {
    order: DonHang;
    onClose: () => void;
    onAction: (id: string, action: 'accept' | 'reject' | 'ship') => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);

    const handle = async (action: 'accept' | 'reject' | 'ship') => {
        setLoading(true);
        await onAction(order.id, action);
        setLoading(false);
    };

    const fmt = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
    const fmtDate = (s: string) =>
        new Date(s).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#dee3de] dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1a261c] z-10">
                    <div>
                        <h2 className="text-lg font-bold text-[#131613] dark:text-white">
                            Chi tiết đơn hàng
                        </h2>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.trangThai} />
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Info row */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-[#f6f8f6] dark:bg-[#1e2d20] rounded-xl p-4">
                            <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wide">Ngày đặt</p>
                            <p className="font-medium text-[#131613] dark:text-white">{fmtDate(order.ngayTao)}</p>
                        </div>
                        <div className="bg-[#f6f8f6] dark:bg-[#1e2d20] rounded-xl p-4">
                            <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wide">Địa chỉ giao</p>
                            <p className="font-medium text-[#131613] dark:text-white text-xs leading-relaxed">
                                {parseAddress(order.diaChiGiaoHang)}
                            </p>
                        </div>
                    </div>

                    {order.ghiChu && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0">note</span>
                            <p className="text-sm text-amber-800 dark:text-amber-200">{order.ghiChu}</p>
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <h3 className="text-sm font-bold text-[#131613] dark:text-white mb-3">Sản phẩm trong đơn</h3>
                        <div className="space-y-3">
                            {order.chiTiet.map(item => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#f6f8f6] dark:bg-[#1e2d20] rounded-xl">
                                    <div
                                        className="w-14 h-14 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 border border-gray-200 dark:border-gray-700"
                                        style={{ backgroundImage: item.hinhAnhUrl ? `url('${item.hinhAnhUrl}')` : undefined }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-[#131613] dark:text-white truncate">{item.tenSanPham}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {item.soLuong} × {fmt(item.donGia)}
                                        </p>
                                    </div>
                                    <p className="font-bold text-sm text-[#131613] dark:text-white shrink-0">
                                        {fmt(item.thanhTien)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-[#dee3de] dark:border-gray-700 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Tiền hàng</span>
                            <span>{fmt(order.tongTien)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Phí vận chuyển</span>
                            <span>{fmt(order.phiVanChuyen)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-[#131613] dark:text-white pt-1 border-t border-dashed border-gray-200 dark:border-gray-600">
                            <span>Tổng thanh toán</span>
                            <span className="text-primary">{fmt(order.tongThanhToan)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    {order.trangThai === 'ChoXuLy' && (
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => handle('reject')}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Từ chối
                            </button>
                            <button
                                onClick={() => handle('accept')}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#246328] text-white font-bold text-sm transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Xác nhận đơn
                            </button>
                        </div>
                    )}
                    {order.trangThai === 'XacNhan' && (
                        <button
                            onClick={() => handle('ship')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                            Chuyển sang giao hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Order Row ─────────────────────────────────────────────────────────────────
function OrderRow({
    order,
    onSelect,
    onAction,
}: {
    order: DonHang;
    onSelect: () => void;
    onAction: (id: string, action: 'accept' | 'reject' | 'ship') => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);
    const fmt = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
    const fmtDate = (s: string) =>
        new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const handle = async (e: React.MouseEvent, action: 'accept' | 'reject' | 'ship') => {
        e.stopPropagation();
        setLoading(true);
        await onAction(order.id, action);
        setLoading(false);
    };

    const firstImg = order.chiTiet[0]?.hinhAnhUrl;
    const itemCount = order.chiTiet.reduce((s, i) => s + i.soLuong, 0);

    return (
        <tr
            onClick={onSelect}
            className="hover:bg-[#f6f8f6] dark:hover:bg-[#1e2d20] cursor-pointer transition-colors border-b border-[#dee3de] dark:border-gray-700"
        >
            {/* Mã đơn */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-700"
                        style={{ backgroundImage: firstImg ? `url('${firstImg}')` : undefined }}
                    >
                        {!firstImg && (
                            <span className="material-symbols-outlined text-gray-400 text-[18px] flex items-center justify-center w-full h-full">
                                inventory_2
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-mono font-bold text-xs text-primary">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{itemCount} sản phẩm</p>
                    </div>
                </div>
            </td>

            {/* Ngày đặt */}
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {fmtDate(order.ngayTao)}
            </td>

            {/* Sản phẩm */}
            <td className="px-4 py-3 text-sm max-w-[200px]">
                <p className="truncate text-[#131613] dark:text-white font-medium">
                    {order.chiTiet[0]?.tenSanPham || 'Không có'}
                </p>
                {order.chiTiet.length > 1 && (
                    <p className="text-xs text-gray-400">+{order.chiTiet.length - 1} sản phẩm khác</p>
                )}
            </td>

            {/* Tổng tiền */}
            <td className="px-4 py-3 text-sm font-bold text-[#131613] dark:text-white whitespace-nowrap">
                {fmt(order.tongThanhToan)}
            </td>

            {/* Trạng thái */}
            <td className="px-4 py-3">
                <StatusBadge status={order.trangThai} />
            </td>

            {/* Hành động */}
            <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                    {order.trangThai === 'ChoXuLy' && (
                        <>
                            <button
                                disabled={loading}
                                onClick={e => handle(e, 'reject')}
                                title="Từ chối"
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </button>
                            <button
                                disabled={loading}
                                onClick={e => handle(e, 'accept')}
                                title="Xác nhận"
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            </button>
                        </>
                    )}
                    {order.trangThai === 'XacNhan' && (
                        <button
                            disabled={loading}
                            onClick={e => handle(e, 'ship')}
                            title="Giao hàng"
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-40"
                        >
                            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        </button>
                    )}
                    <button
                        onClick={onSelect}
                        title="Xem chi tiết"
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SellerOrdersPage: React.FC = () => {
    useSetPageTitle('Quản lý Đơn hàng');

    const [orders, setOrders] = useState<DonHang[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
    const PAGE_SIZE = 10;

    const fetchOrders = useCallback(async (tab: string, page: number) => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = { pageNumber: page, pageSize: PAGE_SIZE };
            if (tab) params.trangThai = tab;
            const res = await getSellerOrders(params as Parameters<typeof getSellerOrders>[0]);
            setOrders(res.data ?? []);
            setTotalRecords(res.totalRecords ?? 0);
        } catch {
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(activeTab, pageNumber);
    }, [activeTab, pageNumber, fetchOrders]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        setPageNumber(1);
    };

    const handleAction = async (id: string, action: 'accept' | 'reject' | 'ship') => {
        const labels = { accept: 'xác nhận', reject: 'từ chối', ship: 'giao hàng' };
        const toastId = toast.loading(`Đang ${labels[action]} đơn hàng...`);
        try {
            if (action === 'accept') await sellerXacNhan(id);
            else if (action === 'reject') await sellerTuChoi(id);
            else await sellerGiaoHang(id);

            toast.success(`Đã ${labels[action]} đơn hàng thành công!`, { id: toastId });
            setSelectedOrder(null);
            fetchOrders(activeTab, pageNumber);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra';
            toast.error(msg, { id: toastId });
        }
    };

    // Stats
    const statCards = [
        { label: 'Tổng đơn hàng', value: totalRecords, icon: 'receipt_long', colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
        { label: 'Chờ xử lý', value: orders.filter(o => o.trangThai === 'ChoXuLy').length, icon: 'pending', colorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' },
        { label: 'Đang giao', value: orders.filter(o => o.trangThai === 'DangGiao').length, icon: 'local_shipping', colorClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' },
        { label: 'Hoàn tất', value: orders.filter(o => o.trangThai === 'HoanTat').length, icon: 'task_alt', colorClass: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
    ];

    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(card => (
                    <div key={card.label} className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 p-4 flex items-center gap-4 shadow-sm">
                        <div className={`p-3 rounded-xl ${card.colorClass}`}>
                            <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-[#131613] dark:text-white">{card.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-[#dee3de] dark:border-gray-700 scrollbar-hide">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-[#131613] dark:hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-primary gap-2">
                        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                        <span className="text-sm text-gray-500">Đang tải đơn hàng...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <span className="material-symbols-outlined text-5xl text-gray-300">receipt_long</span>
                        <p className="text-gray-400 text-sm">Không có đơn hàng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f1f3f1] dark:bg-[#253326] text-[#6b806c] uppercase text-xs">
                                <tr>
                                    <th className="text-left px-4 py-3 font-bold">Mã đơn</th>
                                    <th className="text-left px-4 py-3 font-bold">Ngày đặt</th>
                                    <th className="text-left px-4 py-3 font-bold">Sản phẩm</th>
                                    <th className="text-left px-4 py-3 font-bold">Tổng tiền</th>
                                    <th className="text-left px-4 py-3 font-bold">Trạng thái</th>
                                    <th className="text-right px-4 py-3 font-bold">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        onSelect={() => setSelectedOrder(order)}
                                        onAction={handleAction}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#dee3de] dark:border-gray-700">
                        <p className="text-xs text-gray-500">
                            Trang {pageNumber} / {totalPages} · {totalRecords} đơn hàng
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(p => p - 1)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPageNumber(p)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${p === pageNumber
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                disabled={pageNumber >= totalPages}
                                onClick={() => setPageNumber(p => p + 1)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onAction={handleAction}
                />
            )}
        </div>
    );
};

export default SellerOrdersPage;
