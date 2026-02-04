// src/layouts/DashboardLayout.tsx
import React, { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../../layouts/components/DashboardHeader';

interface DashboardLayoutProps {
    sidebar: ReactNode;
}

export const DashboardLayoutFarmer: React.FC<DashboardLayoutProps> = ({ sidebar }) => {
    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
            {sidebar}
            <div className="flex flex-1 flex-col h-full overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};