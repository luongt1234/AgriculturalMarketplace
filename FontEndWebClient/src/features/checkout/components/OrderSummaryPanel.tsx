import { useState } from 'react';
import type { CartItem, OrderSummary } from "../../../types/checkout.types";
import { useCheckoutStore } from '../../../store/useCheckoutStore';
import { useCartStore } from '../../../store/useCartStore';
import { toast } from 'sonner';

interface OrderSummaryPanelProps {
    items: CartItem[];
    summary: OrderSummary | null;
}

export const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({ items, summary }) => {
    const { updateItemQuantity, removeCartItem } = useCheckoutStore();
    const { updateQuantity, removeFromCart } = useCartStore();
    const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleIncreaseQty = async (item: CartItem) => {
        setLoadingItemId(item.id);
        try {
            await updateQuantity(item.id, item.quantity + 1);
            updateItemQuantity(item.id, item.quantity + 1);
        } catch {
            toast.error('Không thể cập nhật số lượng');
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleDecreaseQty = async (item: CartItem) => {
        if (item.quantity <= 1) return;
        setLoadingItemId(item.id);
        try {
            await updateQuantity(item.id, item.quantity - 1);
            updateItemQuantity(item.id, item.quantity - 1);
        } catch {
            toast.error('Không thể cập nhật số lượng');
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        setDeletingItemId(itemId);
        setConfirmDeleteId(null);
        try {
            await removeFromCart(itemId);
            removeCartItem(itemId);
            toast.success('Đã xóa sản phẩm khỏi đơn hàng');
        } catch {
            toast.error('Không thể xóa sản phẩm');
        } finally {
            setDeletingItemId(null);
        }
    };

    return (
        <div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 sticky top-24">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tóm tắt đơn hàng</h2>
                    <p className="text-sm text-gray-500">{items.length} mặt hàng trong giỏ</p>
                </div>

                {/* Cart Items */}
                <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar">
                    {items.map((item) => {
                        const isLoading = loadingItemId === item.id;
                        const isDeleting = deletingItemId === item.id;
                        const isConfirming = confirmDeleteId === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`flex gap-3 group relative transition-opacity duration-200 ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                            >
                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                                    <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-1">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight flex-1 min-w-0">
                                            {item.name}
                                        </h4>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap flex-shrink-0">
                                            {(item.price * item.quantity).toLocaleString()}₫
                                        </span>
                                    </div>

                                    {/* Quantity controls + Delete */}
                                    <div className="flex items-center justify-between mt-2">
                                        {/* Quantity stepper */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDecreaseQty(item)}
                                                disabled={isLoading || item.quantity <= 1}
                                                title="Giảm số lượng"
                                                className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all text-xs font-bold
                                                    ${item.quantity <= 1
                                                        ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95'
                                                    }`}
                                            >
                                                {isLoading ? (
                                                    <span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[14px]">remove</span>
                                                )}
                                            </button>

                                            <span className="w-7 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => handleIncreaseQty(item)}
                                                disabled={isLoading}
                                                title="Tăng số lượng"
                                                className="w-6 h-6 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95 transition-all text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                                )}
                                            </button>

                                            {item.unit && (
                                                <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                                            )}
                                        </div>

                                        {/* Delete button */}
                                        {isConfirming ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-red-500 font-medium">Xóa?</span>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                                                >
                                                    Có
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    Không
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmDeleteId(item.id)}
                                                disabled={isDeleting}
                                                title="Xóa sản phẩm"
                                                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pricing Summary */}
                <div className="p-5 space-y-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Đơn hàng</span>
                        <span>{summary?.subtotal.toLocaleString() || '0'}₫</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Vận chuyển</span>
                        <span>{summary?.shippingFee ? `${summary.shippingFee.toLocaleString()}₫` : 'Tính ở bước tiếp theo'}</span>
                    </div>
                    {summary?.tax !== undefined && summary.tax > 0 && (
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Thuế</span>
                            <span>{summary.tax.toLocaleString()}₫</span>
                        </div>
                    )}

                    <div className="pt-3 border-t border-dashed border-gray-300 dark:border-gray-600 flex justify-between items-end">
                        <span className="text-base font-bold text-gray-900 dark:text-white">Tổng ước tính</span>
                        <div className="text-right">
                            <span className="text-2xl font-black text-primary">
                                {summary?.total.toLocaleString() || '0'}₫
                            </span>
                            {!summary?.shippingFee && (
                                <p className="text-[10px] text-gray-400">+ phí giao hàng</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="p-5 pt-2">
                    <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span> Thanh toán an toàn 100%
                    </p>
                </div>
            </div>
        </div>
    );
}
