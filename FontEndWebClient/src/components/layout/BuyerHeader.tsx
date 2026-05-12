import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { getSearchSuggestions, type DisplayProduct } from '../../features/products/api/product.api';
import { CartDrawer } from '../../features/cart/components/CartDrawer';
import { BecomeSellerModal } from '../../features/auth/components/BecomeSellerModal';

interface BuyerHeaderProps {
    cartCount?: number;
    onSearchChange?: (query: string) => void;
    showNavigation?: boolean;
}

export const BuyerHeader: React.FC<BuyerHeaderProps> = ({
    onSearchChange,
    showNavigation = true,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<DisplayProduct[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isBecomeSellerOpen, setIsBecomeSellerOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const { cart } = useCartStore();
    const { fetchFavoriteIds } = useFavoriteStore();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const isSeller = user?.maVaiTro === 'NONG-DAN';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSuggestionsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user) {
            fetchFavoriteIds();
        }
    }, [user, fetchFavoriteIds]);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                try {
                    const res = await getSearchSuggestions(searchQuery.trim());
                    // Support if response is nested or flat array
                    setSuggestions(Array.isArray(res) ? res : (res.data || []));
                    setIsSuggestionsOpen(true);
                } catch (error) {
                    console.error('Lỗi khi tải gợi ý:', error);
                }
            } else {
                setSuggestions([]);
                setIsSuggestionsOpen(false);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Hàm tô màu chữ trùng khớp
    const highlightText = (text: string, query: string) => {
        if (!query || !text) return text;
        const terms = query.trim().split(/\s+/).filter(Boolean);
        if (terms.length === 0) return text;

        const regex = new RegExp(`(${terms.join('|')})`, 'gi');
        const parts = text.toString().split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <span key={i} className="text-primary font-bold">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    };

    const handleSearchSubmit = (keyword: string) => {
        if (!keyword.trim()) return;
        setIsSuggestionsOpen(false);
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };

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
        logout();
        setIsProfileOpen(false);
        window.location.href = '/login';
    };

    return (
        <>
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
                        <div className="hidden md:flex flex-1 max-w-xl mx-4" ref={searchRef}>
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
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                                    onFocus={() => searchQuery.trim() && setIsSuggestionsOpen(true)}
                                    placeholder="Tìm kiếm 'Gạo ST25' hoặc 'Trái cây'..."
                                    className="block w-full pl-10 pr-12 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-900 transition duration-150 ease-in-out sm:text-sm"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                    <button
                                        onClick={() => handleSearchSubmit(searchQuery)}
                                        className="p-1 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">mic</span>
                                    </button>
                                </div>

                                {/* Dropdown Gợi Ý */}
                                {isSuggestionsOpen && suggestions.length > 0 && (
                                    <div className="absolute w-full mt-2 bg-white dark:bg-[#1a261c] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                                        <div className="py-2">
                                            {suggestions.map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    onClick={() => {
                                                        setSearchQuery(item.tenHienThi);
                                                        handleSearchSubmit(item.tenHienThi);
                                                    }}
                                                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors gap-3"
                                                >
                                                    {/* Hiển thị avatar cửa hàng nếu có, hoặc ảnh sản phẩm */}
                                                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 bg-cover bg-center"
                                                        style={{ backgroundImage: `url(${item.hinhAnhUrl ? 'http://localhost:5182' + item.hinhAnhUrl : 'https://placehold.co/40x40?text=SP'})` }}
                                                    ></div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {highlightText(item.tenHienThi, searchQuery)}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {item.tenSanPhamChung}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            className="py-2 px-4 bg-gray-50 dark:bg-gray-900/50 text-center border-t border-gray-100 dark:border-gray-800 text-sm font-medium text-primary cursor-pointer hover:underline"
                                            onClick={() => handleSearchSubmit(searchQuery)}
                                        >
                                            Xem tất cả kết quả cho "{searchQuery}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nav and Icons */}
                        <div className="flex items-center gap-2 sm:gap-6">
                            {/* Navigation */}
                            {showNavigation && (
                                <nav className="hidden lg:flex gap-6">
                                    <a href="/" className="text-primary font-semibold text-sm hover:text-primary-dark transition-colors">
                                        Trang chủ
                                    </a>
                                    <a href="/orders" className="text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-primary transition-colors">
                                        Đơn hàng
                                    </a>
                                    <a href="/analytics" className="text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-primary transition-colors">
                                        Thống kê
                                    </a>
                                </nav>
                            )}

                            {/* Icons */}
                            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-2 sm:pl-6">
                                {/* Shopping Cart */}
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-500 hover:text-primary dark:text-gray-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                                    {cart?.chiTiet && cart.chiTiet.length > 0 && (
                                        <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                            {cart.chiTiet.length > 99 ? '99+' : cart.chiTiet.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications */}
                                <button className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden sm:block">
                                    <span className="material-symbols-outlined text-[24px]">notifications</span>
                                </button>

                                {/* Profile Avatar or Login Button */}
                                {user ? (
                                    <div className="relative" ref={profileRef}>
                                        {/* Seller channel button – only for NONG-DAN */}
                                        {/* {isSeller && (
                                            <button
                                                onClick={() => navigate('/farmer')}
                                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors mr-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">storefront</span>
                                                Kênh người bán
                                            </button>
                                        )} */}
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="ml-2 w-9 h-9 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                            style={{
                                                backgroundImage: `url('${user.anhDaiDienUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmrqlq18oih4CNLC6LUhf_qcrLZNtkbQEWbCe8yWG4Vtcb3ab7q4Q3DZ3-gzyr7idsugWlYxUKIHLdvdoiilCz3i_FDAc9OaSRjFtXepMhtMwjrmWnCXOpClSSPmrnpOg0ZGH5J4XLJF6kGwf51ad3AXDgmf_6oKxt1WOUF1giE_M3-WljuyERX2Ir4jiRtErV3C27cCSsYpq2owbSoqFSSW36VLPqZkvKN2m0zgtbt-2hnzt5DaCpCdOL-LUkmI7Sid3OaZM4dg'}')`
                                            }}
                                        />
                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a261c] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                                                {/* User info */}
                                                <div className="px-4 py-2">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.hoTen}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                    <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isSeller
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                                                        }`}>
                                                        {isSeller ? '🌾 Người bán' : '🛒 Người mua'}
                                                    </span>
                                                </div>
                                                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                                                {/* Seller shortcut (mobile) */}
                                                {isSeller && (
                                                    <a
                                                        href="/farmer"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                                                        Kênh người bán
                                                    </a>
                                                )}

                                                <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                                    Hồ sơ
                                                </a>
                                                <a href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                                    Đơn hàng
                                                </a>
                                                <a href="/favorites" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                                                    Sản phẩm yêu thích
                                                </a>

                                                {/* Become Seller – only for buyers */}
                                                {!isSeller && (
                                                    <>
                                                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                                        <button
                                                            onClick={() => { setIsProfileOpen(false); setIsBecomeSellerOpen(true); }}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-700 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">agriculture</span>
                                                            Đăng ký bán hàng
                                                        </button>
                                                    </>
                                                )}

                                                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">logout</span>
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

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <BecomeSellerModal isOpen={isBecomeSellerOpen} onClose={() => setIsBecomeSellerOpen(false)} />
        </>
    );
};
