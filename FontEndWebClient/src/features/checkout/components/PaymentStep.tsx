import type { PaymentMethod } from '../../types/checkout.types';

interface PaymentStepProps {
    methods: PaymentMethod[];
    selectedMethod: PaymentMethod | null;
    onSelectMethod: (method: PaymentMethod) => void;
}

export function PaymentStep({ methods, selectedMethod, onSelectMethod }: PaymentStepProps) {
    return (
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-primary/10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">
                        3
                    </span>
                    Chọn phương thức thanh toán
                </h2>
                <p className="text-sm text-gray-500 mt-1 ml-11">Chọn cách bạn muốn thanh toán</p>
            </div>

            <div className="p-6 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {methods.map((method) => (
                    <label key={method.id} className="relative cursor-pointer group">
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedMethod?.id === method.id}
                            onChange={() => onSelectMethod(method)}
                            className="peer sr-only"
                            disabled={!method.available}
                        />
                        <div
                            className={`p-5 rounded-xl border-2 transition-all ${!method.available
                                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:bg-green-50/30 dark:peer-checked:bg-green-900/10 hover:border-primary/50'
                                }`}
                        >
                            <div className="flex gap-4 mb-3">
                                <div className="flex-shrink-0">
                                    <span className={`material-symbols-outlined text-2xl ${method.available ? 'text-primary' : 'text-gray-400'}`}>
                                        {method.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold mb-1 ${method.available ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {method.name}
                                    </h3>
                                    <p className={`text-xs ${method.available ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`}>
                                        {method.description}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${method.available
                                            ? 'border-gray-300 peer-checked:bg-primary peer-checked:border-primary'
                                            : 'border-gray-300 bg-gray-200 dark:bg-gray-700'
                                            }`}
                                    >
                                        {method.available && selectedMethod?.id === method.id && (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!method.available && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    Sắp có
                                </div>
                            )}
                        </div>
                    </label>
                ))}
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 rounded-b-lg">
                <div className="flex gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0">info</span>
                    <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Thanh toán an toàn</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">Tất cả thanh toán được xử lý an toàn với bảo vệ người mua 100%.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
