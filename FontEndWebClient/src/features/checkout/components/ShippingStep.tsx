import React, { use, useEffect } from 'react';
import type { ShippingMethod } from '../../../types/checkout.types';

interface ShippingStepProps {
    methods: ShippingMethod[];
    selectedMethod: ShippingMethod | null;
    onSelectMethod: (method: ShippingMethod) => void;
    loading?: boolean;
}

export const ShippingStep: React.FC<ShippingStepProps> = ({
    methods,
    selectedMethod,
    onSelectMethod,
    loading = false
}) => {
    useEffect(() => {
        console.log('Available shipping methods:', methods);
    }, [methods]);

    const content = loading ? (
        <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Đang tải các phương thức vận chuyển...</div>
    ) : methods.length === 0 ? (
        <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Không tìm thấy phương thức vận chuyển phù hợp. Vui lòng kiểm tra lại địa chỉ.</div>
    ) : (
        <div className="p-6 grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {methods.map((method) => {
                const isSelected = selectedMethod?.id === method.id;
                return (
                    <label key={method.id} className="relative cursor-pointer group">
                        <input
                            type="radio"
                            name="shipping"
                            checked={isSelected}
                            onChange={() => onSelectMethod(method)}
                            className="sr-only"
                        />
                        <div className={`p-5 rounded-xl border-2 transition-all ${
                            isSelected
                                ? 'border-primary bg-green-50/30 dark:bg-green-900/10'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50'
                        }`}>
                            <div className="flex gap-4 mb-3">
                                <div className="flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-2xl">{method.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{method.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                                    }`}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Thời gian giao hàng dự kiến</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{method.estimatedDays}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Phí</p>
                                    <p className="text-lg font-bold text-primary">
                                        {(isSelected ? selectedMethod!.baseFee : method.baseFee || 0).toLocaleString()}₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );

    return (
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-primary/10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">
                        2
                    </span>
                    Chọn phương thức vận chuyển
                </h2>
                <p className="text-sm text-gray-500 mt-1 ml-11">Chọn phương thức giao hàng và tốc độ ưa thích</p>
            </div>

            {content}
        </section>
    );
}
