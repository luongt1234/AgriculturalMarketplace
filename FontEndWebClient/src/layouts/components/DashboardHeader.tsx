import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';

export const DashboardHeader: React.FC = () => {
    const { pageTitle, headerActions } = useUIStore();
    const { user } = useAuthStore();

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

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

                {user?.anhDaiDienUrl ? (
                    <img
                        src={user.anhDaiDienUrl}
                        alt={user.hoTen}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                ) : (
                    <div
                        className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm cursor-pointer"
                        title={user?.hoTen}
                    >
                        {getInitials(user?.hoTen)}
                    </div>
                )}
            </div>
        </header>
    );
};