import React from 'react';
import { Link } from 'react-router-dom';

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
                    <Link to="/farmer/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                        <span className="material-symbols-outlined icon-filled">dashboard</span>
                        <span className="text-sm font-semibold">Tổng quan</span>
                    </Link>
                    <Link to="/farmer/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#131613] dark:text-gray-300 hover:bg-[#f1f3f1] dark:hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">inventory_2</span>
                        <span className="text-sm font-medium">Sản phẩm</span>
                    </Link>
                    <Link to="/farmer/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#131613] dark:text-gray-300 hover:bg-[#f1f3f1] dark:hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">shopping_cart</span>
                        <span className="text-sm font-medium">Đơn hàng</span>
                    </Link>
                    <Link to="/farmer/contracts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#131613] dark:text-gray-300 hover:bg-[#f1f3f1] dark:hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">history_edu</span>
                        <span className="text-sm font-medium">Hợp đồng</span>
                    </Link>

                    <div className="pt-4 mt-2 border-t border-[#f1f3f1] dark:border-gray-700">
                        <p className="px-3 text-xs font-semibold text-[#6b806c] uppercase tracking-wider mb-2">Cài đặt</p>
                        <Link to="/farmer/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#131613] dark:text-gray-300 hover:bg-[#f1f3f1] dark:hover:bg-white/5 transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-primary transition-colors">settings</span>
                            <span className="text-sm font-medium">Cấu hình Shop</span>
                        </Link>
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