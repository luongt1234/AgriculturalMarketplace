// src/layouts/DashboardLayout.tsx
import React, { type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DashboardHeader } from '../../layouts/components/DashboardHeader';

interface DashboardLayoutProps {
    sidebar: ReactNode;
}

export const DashboardLayoutFarmer: React.FC<DashboardLayoutProps> = ({ sidebar }) => {
    const location = useLocation();
    const isChat = location.pathname.includes('/chat');

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
            {sidebar}
            <div className="flex flex-1 flex-col h-full overflow-hidden">
                <DashboardHeader />

                <main className={`flex-1 overflow-y-auto p-6`}>
                    <div className={`mx-auto flex flex-col ${isChat ? 'h-full w-full max-w-[1600px] gap-6' : 'max-w-[1600px] gap-6'}`}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};