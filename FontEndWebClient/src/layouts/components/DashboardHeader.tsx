// src/layouts/components/DashboardHeader.tsx
import React from 'react';
import { useUIStore } from '../../store/useUIStore';

export const DashboardHeader: React.FC = () => {
    // Lấy data từ Store
    const { pageTitle, headerActions } = useUIStore();

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D1A] flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {pageTitle}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div id="header-actions">
                    {headerActions}
                </div>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    AD
                </div>
            </div>
        </header>
    );
};