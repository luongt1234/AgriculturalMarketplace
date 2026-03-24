// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export const AdminLayout: React.FC = () => {
    return (
        <div className="bg-background-light font-sans text-gray-900 antialiased overflow-hidden h-screen flex">
            <AdminSidebar />

            <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light relative">
                <Outlet />
            </main>
        </div>
    );
};