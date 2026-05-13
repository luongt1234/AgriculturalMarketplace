import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_PERMISSIONS, type AdminPermissionCode } from '../../features/admin/constants/adminPermissions';
import { useAdminPermissions } from '../../features/admin/hooks/useAdminPermissions';

const AdminSidebar: React.FC = () => {
    const { hasPermission } = useAdminPermissions();

    const mainMenus: Array<{ name: string; icon: string; path: string; permission: AdminPermissionCode }> = [
        { name: 'Tổng quan', icon: 'dashboard', path: '/admin/dashboard', permission: ADMIN_PERMISSIONS.DASHBOARD },
        { name: 'Quản lý người mua', icon: 'group', path: '/admin/buyer', permission: ADMIN_PERMISSIONS.BUYER },
        { name: 'Quản lý người bán', icon: 'storefront', path: '/admin/seller', permission: ADMIN_PERMISSIONS.SELLER },
        { name: 'Quản lý tài khoản quản trị', icon: 'admin_panel_settings', path: '/admin/admin-management', permission: ADMIN_PERMISSIONS.ADMIN_ACCOUNTS },
        { name: 'Quản lý danh mục', icon: 'category', path: '/admin/category', permission: ADMIN_PERMISSIONS.CATEGORY },
        { name: 'Quản lý Voucher', icon: 'confirmation_number', path: '/admin/vouchers', permission: ADMIN_PERMISSIONS.VOUCHER },
    ];

    const systemMenus: Array<{ name: string; icon: string; path: string; permission: AdminPermissionCode }> = [
        { name: 'Cài đặt giao diện', icon: 'settings', path: '/admin/settings', permission: ADMIN_PERMISSIONS.SETTINGS },
        { name: 'Phân quyền', icon: 'security', path: '/admin/permissions', permission: ADMIN_PERMISSIONS.PERMISSIONS },
    ];

    const visibleMainMenus = mainMenus.filter((item) => hasPermission(item.permission));
    const visibleSystemMenus = systemMenus.filter((item) => hasPermission(item.permission));

    return (
        <aside className="w-64 bg-white dark:bg-[#1a261c] flex flex-col h-full shrink-0 transition-all duration-300 border-r border-[#dee3de] dark:border-gray-700 text-[#131613] dark:text-white">
            <div className="h-16 flex items-center px-6 border-b border-[#dee3de] dark:border-gray-700 bg-white dark:bg-[#1a261c]">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl">eco</span>
                    </div>
                    <h2 className="text-gray-900 dark:text-white text-xl font-extrabold tracking-tight">
                        PeachyMarket
                    </h2>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
                <p className="px-3 text-[11px] font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wider mb-2">
                    Chức năng chính
                </p>

                {visibleMainMenus.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                ? 'bg-primary/5 dark:bg-primary/10 text-primary font-semibold'
                                : 'text-[#6b806c] dark:text-gray-400 hover:text-primary hover:bg-[#f1f3f1] dark:hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'icon-filled' : 'group-hover:text-primary'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                <p className="px-3 text-[11px] font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wider mt-6 mb-2">
                    Hệ thống
                </p>

                {visibleSystemMenus.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                ? 'bg-primary/5 dark:bg-primary/10 text-primary font-semibold'
                                : 'text-[#6b806c] dark:text-gray-400 hover:text-primary hover:bg-[#f1f3f1] dark:hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'icon-filled' : 'group-hover:text-primary'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[#dee3de] dark:border-gray-700 bg-white dark:bg-[#1a261c]">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f1f3f1] dark:hover:bg-white/5 cursor-pointer transition-colors group">
                    <div
                        className="size-8 rounded-full bg-cover bg-center ring-2 ring-[#dee3de] dark:ring-gray-600 group-hover:ring-primary/30 transition-all shrink-0"
                        style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Admin&background=2f7f34&color=fff")' }}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-bold text-[#131613] dark:text-white truncate">Quản trị viên</p>
                        <p className="text-[11px] text-[#6b806c] dark:text-gray-400 truncate">admin@agriconnect.vn</p>
                    </div>
                    <button className="ml-auto flex items-center shrink-0" title="Đăng xuất">
                        <span className="material-symbols-outlined text-[#6b806c] dark:text-gray-400 text-lg group-hover:text-red-500 transition-colors">
                            logout
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
