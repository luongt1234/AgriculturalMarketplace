import React from 'react';

export const ActionCenter: React.FC = () => {
    return (
        <div className="xl:col-span-1 bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col">
            <div className="p-6 border-b border-[#f1f3f1] dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-[#131613] dark:text-white text-lg font-bold leading-tight">Cần xử lý</h3>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">3 Mới</span>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                {/* Item 1 */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                    <div className="mt-0.5 text-orange-600 dark:text-orange-500 bg-white dark:bg-orange-900/20 rounded-full p-1 shadow-sm">
                        <span className="material-symbols-outlined text-[20px] block">package_2</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#131613] dark:text-white text-sm font-semibold">3 Đơn hàng cần đóng gói</p>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">Hạn giao: 17:00 Hôm nay</p>
                        <button className="mt-2 text-xs font-bold text-white bg-primary hover:bg-green-800 px-3 py-1.5 rounded transition-colors">Đóng gói ngay</button>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f6f8f6] dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="mt-0.5 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-full p-1">
                        <span className="material-symbols-outlined text-[20px] block">add_shopping_cart</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#131613] dark:text-white text-sm font-semibold">Bổ sung kho (5 sản phẩm)</p>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">Kho "Ngô nếp" sắp hết</p>
                        <button className="mt-2 text-xs font-bold text-primary dark:text-primary-400 hover:underline">Đến kho hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};