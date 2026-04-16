import type { DeliveryAddress, OrderSummary, PaymentMethod, ShippingMethod } from "../../../types/checkout.types";

interface ConfirmationStepProps {
    address: DeliveryAddress | null;
    shippingMethod: ShippingMethod | null;
    paymentMethod: PaymentMethod | null;
    orderSummary: OrderSummary | null;
    onConfirm: () => void;
    loading?: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    address,
    shippingMethod,
    paymentMethod,
    orderSummary,
    onConfirm,
    loading = false,
}) => {
    return (
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-primary/10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">
                        4
                    </span>
                    Xác nhận đơn hàng của bạn
                </h2>
                <p className="text-sm text-gray-500 mt-1 ml-11">Xem lại chi tiết đơn hàng trước khi gửi</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Delivery Address */}
                {address && (
                    <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Địa chỉ giao hàng</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Nơi đơn hàng sẽ được giao</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 ml-9">
                            <p className="font-semibold text-gray-900 dark:text-white">{address.fullName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{address.phone}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{address.detailedAddress}</p>
                        </div>
                    </div>
                )}

                {/* Shipping Method */}
                {shippingMethod && (
                    <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Phương thức vận chuyển</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Cách đơn hàng sẽ được giao</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 ml-9">
                            <p className="font-semibold text-gray-900 dark:text-white">{shippingMethod.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{shippingMethod.description}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-gray-500">Thời gian giao hàng dự kiến:</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{shippingMethod.estimatedDays}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Method */}
                {paymentMethod && (
                    <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="material-symbols-outlined text-primary text-2xl">payment</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Phương thức thanh toán</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Cách bạn sẽ thanh toán cho đơn hàng này</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 ml-9">
                            <p className="font-semibold text-gray-900 dark:text-white">{paymentMethod.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{paymentMethod.description}</p>
                        </div>
                    </div>
                )}

                {/* Order Summary */}
                {orderSummary && (
                    <div className="pb-6">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Tóm tắt đơn hàng</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{orderSummary.items.length} mặt hàng trong đơn</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 ml-9 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tổng phụ</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {orderSummary.subtotal.toLocaleString()}₫
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {orderSummary.shippingFee.toLocaleString()}₫
                                </span>
                            </div>
                            {orderSummary.tax !== undefined && orderSummary.tax > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Thuế</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {orderSummary.tax.toLocaleString()}₫
                                    </span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                                <span className="font-bold text-gray-900 dark:text-white">Tổng cộng</span>
                                <span className="text-2xl font-black text-primary">{orderSummary.total.toLocaleString()}₫</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Button */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                <button
                    onClick={onConfirm}
                    disabled={loading || !address || !shippingMethod || !paymentMethod}
                    className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">hourglass_top</span>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">done_all</span>
                            Xác nhận và gửi đơn hàng
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
