import type { CartItem, OrderSummary } from "../../../types/checkout.types";

interface OrderSummaryPanelProps {
    items: CartItem[];
    summary: OrderSummary | null;
}

export function OrderSummaryPanel({ items, summary }: OrderSummaryPanelProps) {
    return (
        <div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 sticky top-24">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tóm tắt đơn hàng</h2>
                    <p className="text-sm text-gray-500">{items.length} mặt hàng trong giỏ</p>
                </div>

                {/* Cart Items */}
                <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                                        {item.name}
                                    </h4>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    SL: {item.quantity}
                                    {item.unit && ` ${item.unit}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing Summary */}
                <div className="p-5 space-y-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Tổng phụ</span>
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
