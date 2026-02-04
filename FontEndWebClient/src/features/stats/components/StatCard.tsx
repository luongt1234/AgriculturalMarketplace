import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendLabel?: string;
    icon: string;
    colorClass: 'primary' | 'blue' | 'orange' | 'yellow'; // Định nghĩa màu
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendLabel, icon, colorClass }) => {
    // Map màu sắc dựa trên props
    const colorMap = {
        primary: { text: 'text-primary', bg: 'bg-primary/10', iconColor: 'text-primary' },
        blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600' },
        orange: { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-500' },
        yellow: { text: 'text-primary', bg: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-yellow-500' }, // Dùng primary cho text trend của thẻ vàng như mẫu
    };

    const theme = colorMap[colorClass];

    return (
        <div className="bg-white dark:bg-[#1a261c] rounded-xl p-5 border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className={`absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${theme.iconColor}`}>
                <span className="material-symbols-outlined text-6xl">{icon}</span>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[#6b806c] dark:text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-[#131613] dark:text-white text-2xl font-bold tracking-tight">{value}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
                <span className={`${theme.bg} ${theme.text} px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-0.5`}>
                    {/* Logic icon trend đơn giản */}
                    {colorClass === 'orange' ? <span className="material-symbols-outlined text-[14px]">warning</span> : <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                    {trend}
                </span>
                <span className="text-[#6b806c] dark:text-gray-500 text-xs ml-1">{trendLabel}</span>
            </div>
        </div>
    );
};