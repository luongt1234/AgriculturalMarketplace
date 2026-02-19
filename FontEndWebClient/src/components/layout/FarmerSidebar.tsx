import React from 'react';
import { NavLink } from 'react-router-dom';

const MENU_ITEMS = [
    { path: '/farmer/dashboard', icon: 'dashboard', label: 'Tổng quan' },
    { path: '/farmer/products', icon: 'inventory_2', label: 'Sản phẩm' },
    { path: '/farmer/orders', icon: 'shopping_cart', label: 'Đơn hàng' },
    { path: '/farmer/contracts', icon: 'history_edu', label: 'Hợp đồng' },
    { path: '/farmer/logs', icon: 'menu_book', label: 'Nhật kí canh tác' },
];

export const FarmerSidebar: React.FC = () => {
    return (
        <aside className="w-64 flex-shrink-0 border-r border-[#dee3de] dark:border-gray-700 bg-white dark:bg-[#1a261c] flex flex-col justify-between h-screen sticky top-0">
            <div className="flex flex-col h-full">
                {/* Profile / Brand */}
                <div className="p-6 border-b border-[#f1f3f1] dark:border-gray-700">
                    <div className="flex gap-3 items-center">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
                            style={{ backgroundImage: 'url("https://via.placeholder.com/150")' }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-[#131613] dark:text-white text-base font-bold leading-tight truncate">GreenAcres Farm</h1>
                            <p className="text-[#6b806c] dark:text-gray-400 text-xs font-normal leading-normal truncate">Agri-Business Seller</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {/* Render các menu chính */}
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

                    {/* Menu Cài đặt (Render riêng vì có đường kẻ chia ngăn) */}
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

                {/* Footer Action */}
                <div className="p-4 border-t border-[#f1f3f1] dark:border-gray-700">
                    <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-bold leading-normal">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="truncate">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};