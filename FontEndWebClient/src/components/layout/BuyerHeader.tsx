import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface BuyerHeaderProps {
    cartCount?: number;
    onSearchChange?: (query: string) => void;
    showNavigation?: boolean;
}

export const BuyerHeader: React.FC<BuyerHeaderProps> = ({
    cartCount = 0,
    onSearchChange,
    showNavigation = true
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuthStore();

    // useEffect(() => {
    //     const storedUser = localStorage.getItem('user');
    //     if (storedUser) {
    //         try {
    //             setUser(JSON.parse(storedUser));
    //         } catch (error) {
    //             console.error('Error parsing user from localStorage:', error);
    //         }
    //     }
    // }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearchChange?.(value);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-storage');
        // setUser(null);
        setIsProfileOpen(false);
        // Có thể redirect hoặc refresh page
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-[#1a261c] border-b border-[#e0e0e0] dark:border-[#2f3e30] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl">eco</span>
                        </div>
                        <h2 className="text-gray-900 dark:text-white text-xl font-extrabold tracking-tight">
                            PeachyMarket
                        </h2>
                    </div>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-4">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                                    search
                                </span>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Tìm kiếm 'Gạo ST25' hoặc 'Trái cây'..."
                                className="block w-full pl-10 pr-12 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-900 transition duration-150 ease-in-out sm:text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                <button className="p-1 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Nav and Icons */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        {/* Navigation */}
                        {showNavigation && (
                            <nav className="hidden lg:flex gap-6">
                                <a href="#" className="text-primary font-semibold text-sm hover:text-primary-dark transition-colors">
                                    Trang chủ
                                </a>
                                <a href="#" className="text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-primary transition-colors">
                                    Thị trường
                                </a>
                                <a href="#" className="text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-primary transition-colors">
                                    Thống kê
                                </a>
                            </nav>
                        )}

                        {/* Icons */}
                        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-2 sm:pl-6">
                            {/* Shopping Cart */}
                            <button className="relative p-2 text-gray-500 hover:text-primary dark:text-gray-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications */}
                            <button className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden sm:block">
                                <span className="material-symbols-outlined text-[24px]">notifications</span>
                            </button>

                            {/* Profile Avatar or Login Button */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="ml-2 w-9 h-9 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                        style={{
                                            backgroundImage: `url('${user.anhDaiDienUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmrqlq18oih4CNLC6LUhf_qcrLZNtkbQEWbCe8yWG4Vtcb3ab7q4Q3DZ3-gzyr7idsugWlYxUKIHLdvdoiilCz3i_FDAc9OaSRjFtXepMhtMwjrmWnCXOpClSSPmrnpOg0ZGH5J4XLJF6kGwf51ad3AXDgmf_6oKxt1WOUF1giE_M3-WljuyERX2Ir4jiRtErV3C27cCSsYpq2owbSoqFSSW36VLPqZkvKN2m0zgtbt-2hnzt5DaCpCdOL-LUkmI7Sid3OaZM4dg'}')`
                                        }}
                                    />
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a261c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                            <div className="px-4 py-2 text-sm text-gray-900 dark:text-white font-medium">
                                                {user.hoTen}
                                            </div>
                                            <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                Hồ sơ
                                            </a>
                                            <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                Đơn hàng
                                            </a>
                                            <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                                >
                                    Đăng nhập
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-4 pb-3">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="block w-full pl-9 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                            <span className="material-symbols-outlined text-gray-400 text-sm">mic</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
