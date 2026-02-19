import React from 'react';

export const LogStatCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            {/* Thẻ 1 */}
            <div className="bg-white dark:bg-[#1a261c] rounded-xl p-6 border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-[#6b806c] dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Tổng số bản ghi</p>
                    <p className="text-[#131613] dark:text-white text-3xl font-bold tracking-tight">8,492</p>
                    <p className="text-xs text-[#6b806c] dark:text-gray-500 mt-1">Kể từ Genesis Block (01/2022)</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-3xl">storage</span>
                </div>
            </div>

            {/* Thẻ 2 */}
            <div className="bg-white dark:bg-[#1a261c] rounded-xl p-6 border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-[#6b806c] dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Chiều cao Block</p>
                    <p className="text-[#131613] dark:text-white text-3xl font-bold tracking-tight">#14,205,891</p>
                    <p className="text-xs text-[#6b806c] dark:text-gray-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> Block cuối: 12s trước
                    </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-full text-purple-600 dark:text-purple-400">
                    <span className="material-symbols-outlined text-3xl">deployed_code</span>
                </div>
            </div>

            {/* Thẻ 3 */}
            <div className="bg-white dark:bg-[#1a261c] rounded-xl p-6 border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center justify-between relative overflow-hidden">
                <div className="flex flex-col gap-1 z-10">
                    <p className="text-[#6b806c] dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Trạng thái đồng bộ</p>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-[#131613] dark:text-white text-2xl font-bold tracking-tight">Đã đồng bộ</p>
                        <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(47,127,52,0.8)]"></div>
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">Trực tuyến</span>
                    </div>
                    <p className="text-xs text-[#6b806c] dark:text-gray-500 mt-1">Mạng lưới: AgriChain Mainnet</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full text-primary dark:text-green-400 z-10">
                    <span className="material-symbols-outlined text-3xl">sync_alt</span>
                </div>
                <div className="absolute -right-6 -bottom-6 text-primary opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <span className="material-symbols-outlined text-9xl">hub</span>
                </div>
            </div>
        </div>
    );
};