import type { ShippingMethod } from '../../../types/checkout.types';

interface ShippingStepProps {
    methods: ShippingMethod[];
    selectedMethod: ShippingMethod | null;
    onSelectMethod: (method: ShippingMethod) => void;
}

export function ShippingStep({ methods, selectedMethod, onSelectMethod }: ShippingStepProps) {
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

            <div className="p-6 grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {methods.map((method) => (
                    <label key={method.id} className="relative cursor-pointer group">
                        <input
                            type="radio"
                            name="shipping"
                            checked={selectedMethod?.id === method.id}
                            onChange={() => onSelectMethod(method)}
                            className="peer sr-only"
                        />
                        <div className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:bg-green-50/30 dark:peer-checked:bg-green-900/10 transition-all hover:border-primary/50">
                            <div className="flex gap-4 mb-3">
                                <div className="flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-2xl">{method.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{method.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-colors">
                                        <div className="hidden peer-checked:block w-2.5 h-2.5 bg-white rounded-full"></div>
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
                                    <p className="text-lg font-bold text-primary">{method.baseFee.toLocaleString()}₫</p>
                                </div>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </section>
    );
}
