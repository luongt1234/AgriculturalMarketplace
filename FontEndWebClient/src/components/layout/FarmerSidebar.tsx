import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const MENU_ITEMS = [
    { path: '/farmer/dashboard', icon: 'dashboard', label: 'Tổng quan' },
    { path: '/farmer/products', icon: 'inventory_2', label: 'Sản phẩm' },
    { path: '/farmer/orders', icon: 'shopping_cart', label: 'Đơn hàng' },
    { path: '/farmer/contracts', icon: 'history_edu', label: 'Hợp đồng' },
    { path: '/farmer/logs', icon: 'menu_book', label: 'Nhật kí canh tác' },
];

export const FarmerSidebar: React.FC = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <aside className="w-64 flex-shrink-0 border-r border-[#dee3de] dark:border-gray-700 bg-white dark:bg-[#1a261c] flex flex-col justify-between h-screen sticky top-0">
            <div className="flex flex-col h-full">

                <div className="p-6 border-b border-[#f1f3f1] dark:border-gray-700">
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center justify-center rounded-xl size-10 bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-md shadow-orange-200 dark:shadow-none flex-shrink-0">
                            {/* Icon Storefront (Sàn giao dịch) phong cách bo tròn hiện đại */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627-.47 1.406-.75 2.25-.75.844 0 1.624.28 2.25.75.626-.47 1.406-.75 2.25-.75.844 0 1.623.28 2.25.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z" />
                                <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c1.665 0 3.206-.513 4.5-1.505V15a.75.75 0 0 1-1.5 0v-2.25H9v2.25a.75.75 0 0 1-1.5 0V12h-.75v8.25c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-5.25c1.42.674 3.08.673 4.5 0v8.755a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-[#131613] dark:text-white text-[1.35rem] font-extrabold leading-tight truncate tracking-tight">
                                Peachy<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Market</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em] mt-0.5 truncate">
                                Seller Portal
                            </p>
                        </div>

                    </div>
                </div>

                {/* ================= NAVIGATION ================= */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {MENU_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                    : 'text-[#131613] dark:text-gray-300 hover:bg-[#f1f3f1] dark:hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`material-symbols-outlined transition-colors ${isActive ? 'icon-filled' : 'group-hover:text-primary'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Menu Cài đặt */}
                    <div className="pt-4 mt-2 border-t border-[#f1f3f1] dark:border-gray-700">
                        <p className="px-3 text-xs font-semibold text-[#6b806c] uppercase tracking-wider mb-2">Cài đặt</p>
                        <NavLink
                            to="/farmer/settings"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                    : 'text-[#131613] dark:text-gray-300 hover:bg-[#f1f3f1] dark:hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`material-symbols-outlined transition-colors ${isActive ? 'icon-filled' : 'group-hover:text-primary'}`}>
                                        settings
                                    </span>
                                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                        Cấu hình Shop
                                    </span>
                                </>
                            )}
                        </NavLink>
                    </div>
                </nav>

                {/* ================= FOOTER ACTION ================= */}
                <div className="p-4 border-t border-[#f1f3f1] dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-bold leading-normal"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="truncate">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};