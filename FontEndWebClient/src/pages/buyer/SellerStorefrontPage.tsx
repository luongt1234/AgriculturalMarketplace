import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { useAuthStore } from '../../store/useAuthStore';
import { BuyerFloatingButtons } from '../../components/buyer/BuyerFloatingButtons';
import { useCartStore } from '../../store/useCartStore';
import {
    checkFollow,
    followSeller,
    getSellerProducts,
    getSellerProfile,
    unfollowSeller,
} from '../../features/sellerStorefront/api/storefront.api';
import type { SellerProduct, SellerProfile } from '../../features/sellerStorefront/api/storefront.api';
import { voucherApi } from '../../features/voucher/api/voucherApi';
import type { VoucherPublicDto } from '../../types/voucher.types';

const PLACEHOLDER_BANNER = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80';
const PLACEHOLDER_AVATAR = 'https://ui-avatars.com/api/?background=2f7f34&color=fff&size=128&name=';
const PLACEHOLDER_PRODUCT = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70';

const SkeletonCard = () => (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="flex justify-between items-end mt-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    </div>
);

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
    <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={`material-symbols-outlined ${s <= Math.floor(rating) ? 'filled' : ''}`}
                style={{ fontSize: size }}>star</span>
        ))}
    </div>
);

const SellerStorefrontPage: React.FC = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { addToCart } = useCartStore();

    // Profile state
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);

    // Products state
    const [products, setProducts] = useState<SellerProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const PAGE_SIZE = 9;

    // Voucher tab
    type MainTab = 'products' | 'vouchers';
    const [activeTab, setActiveTab] = useState<MainTab>('products');
    const [shopVouchers, setShopVouchers] = useState<VoucherPublicDto[]>([]);
    const [voucherLoading, setVoucherLoading] = useState(false);

    // ─── Load profile ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!sellerId) return;
        (async () => {
            try {
                setLoadingProfile(true);
                const data = await getSellerProfile(sellerId);
                setProfile(data);
                setIsFollowing(data.dangTheoDoi);
                setFollowerCount(data.soNguoiTheoDoi);
            } catch {
                toast.error('Không thể tải thông tin cửa hàng.');
                navigate('/');
            } finally {
                setLoadingProfile(false);
            }
        })();
    }, [sellerId, navigate]);

    // ─── Load products ────────────────────────────────────────────────────
    const loadProducts = useCallback(async () => {
        if (!sellerId) return;
        try {
            setLoadingProducts(true);
            const res = await getSellerProducts(sellerId, page, PAGE_SIZE, search || undefined, activeCategory || undefined);
            setProducts(res.data ?? []);
            setTotalPages(res.totalPages ?? 1);
            setTotalRecords(res.totalRecords ?? 0);
        } catch {
            toast.error('Không thể tải sản phẩm.');
        } finally {
            setLoadingProducts(false);
        }
    }, [sellerId, page, search, activeCategory]);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    // Load vouchers when tab switches
    useEffect(() => {
        if (activeTab !== 'vouchers' || !sellerId) return;
        (async () => {
            setVoucherLoading(true);
            try {
                const data = await voucherApi.getShopVouchers(sellerId);
                setShopVouchers(data);
            } catch { toast.error('Không thể tải voucher.'); }
            finally { setVoucherLoading(false); }
        })();
    }, [activeTab, sellerId]);

    // ─── Follow / Unfollow ────────────────────────────────────────────────
    const handleFollowToggle = async () => {
        if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để theo dõi cửa hàng.'); return; }
        if (!sellerId) return;
        try {
            setFollowLoading(true);
            if (isFollowing) {
                await unfollowSeller(sellerId);
                setIsFollowing(false);
                setFollowerCount(c => Math.max(0, c - 1));
                toast.success('Đã huỷ theo dõi cửa hàng.');
            } else {
                await followSeller(sellerId);
                setIsFollowing(true);
                setFollowerCount(c => c + 1);
                toast.success('Đã theo dõi cửa hàng!');
            }
        } catch { toast.error('Có lỗi xảy ra. Vui lòng thử lại.'); }
        finally { setFollowLoading(false); }
    };

    const handleAddToCart = async (product: SellerProduct) => {
        try {
            await addToCart({ sanPhamDangId: product.id, soLuong: 1 });
            toast.success(`Đã thêm "${product.tenHienThi}" vào giỏ hàng`);
        } catch (error) {
            toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleCategory = (cat: string) => {
        setActiveCategory(cat);
        setPage(1);
    };

    const handleClaimVoucher = async (voucherId: string) => {
        if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để lấy voucher.'); return; }
        try {
            const res = await voucherApi.claimVoucher(voucherId);
            toast.success(`Đã lấy voucher! Mã: ${res.code}`);
            setShopVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, daLay: true, soLuongConLai: Math.max(0, v.soLuongConLai - 1) } : v));
        } catch (err: any) { toast.error(err?.response?.data?.message || 'Không thể lấy voucher.'); }
    };

    const joinedYears = profile
        ? Math.max(0, new Date().getFullYear() - new Date(profile.ngayThamGia).getFullYear())
        : 0;

    if (loadingProfile) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen">
                <BuyerHeader showNavigation />
                <div className="animate-pulse max-w-7xl mx-auto px-4 py-8 space-y-6">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
                <BuyerFooter />
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
            <BuyerHeader showNavigation />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="h-48 md:h-64 relative">
                        <img
                            src={profile?.anhBiaUrl || PLACEHOLDER_BANNER}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-4 gap-4 md:gap-6">
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-surface-dark bg-surface-light shadow-md overflow-hidden">
                                    <img
                                        src={profile?.anhDaiDienUrl || `${PLACEHOLDER_AVATAR}${encodeURIComponent(profile?.hoTen || 'shop')}`}
                                        alt={profile?.hoTen}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex-1 text-white md:text-gray-900 md:dark:text-white pt-2 md:pt-0 md:mb-2">
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow md:drop-shadow-none">
                                        {profile?.hoTen}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                                        <span className="material-symbols-outlined filled text-[14px]">verified</span>
                                        VietGAP
                                    </span>
                                </div>
                                <p className="text-gray-200 md:text-gray-500 text-sm mt-1 drop-shadow md:drop-shadow-none">
                                    {profile?.diaChi || 'Nông sản hữu cơ tươi sạch, trực tiếp từ trang trại.'}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-2 md:mt-0 md:mb-4 w-full md:w-auto">
                                <button
                                    id="btn-follow-seller"
                                    onClick={handleFollowToggle}
                                    disabled={followLoading}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm
                                        ${isFollowing
                                            ? 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                                            : 'bg-primary hover:bg-primary-dark text-white'
                                        } disabled:opacity-60`}
                                >
                                    {followLoading
                                        ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        : <span className="material-symbols-outlined text-[18px]">{isFollowing ? 'person_remove' : 'person_add'}</span>
                                    }
                                    <span>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
                                </button>

                                <button
                                    id="btn-chat-seller"
                                    onClick={() => document.getElementById('floating-chat-trigger')?.click()}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-light border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-surface-dark dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chat</span>
                                    Chat
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-4 border-t border-gray-100 dark:border-gray-700">
                            {[
                                { bg: 'bg-orange-100 text-orange-600', icon: 'star', label: 'Đánh giá', value: `${profile?.danhGiaTrungBinh?.toFixed(1)} / 5.0` },
                                { bg: 'bg-blue-100 text-blue-600', icon: 'forum', label: 'Phản hồi', value: `${profile?.tiLePhanhHoi}%` },
                                { bg: 'bg-purple-100 text-purple-600', icon: 'calendar_month', label: 'Tham gia', value: joinedYears > 0 ? `${joinedYears} năm` : '< 1 năm' },
                                { bg: 'bg-green-100 text-green-600', icon: 'inventory_2', label: 'Sản phẩm', value: `${profile?.soSanPham}+` },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-3 px-2 py-2 border-l first:border-l-0 border-gray-100 dark:border-gray-700">
                                    <div className={`p-2 rounded-lg ${stat.bg} shrink-0`}>
                                        <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-base text-gray-900 dark:text-white">{stat.value}</div>
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1 space-y-6">
                        {/* sidebar unchanged */}
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                Về cửa hàng
                            </h3>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <p className="leading-relaxed">{profile?.moTaCuaHang || 'Cam kết nông nghiệp bền vững, không hoá chất, trực tiếp từ vùng trồng.'}</p>
                                {profile?.diaChi && (
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
                                        <span>{profile.diaChi}</span>
                                    </div>
                                )}
                                {profile?.soDienThoai && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                                        <span>{profile.soDienThoai}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px]">group</span>
                                    <span>{followerCount.toLocaleString('vi-VN')} người theo dõi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                                    <span>Thứ 2 – Thứ 7: 08:00 – 17:00</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Chứng nhận</h3>
                            <div className="flex flex-wrap gap-2">
                                {['VietGAP', 'Organic', 'HACCP'].map((c) => (
                                    <span key={c} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="lg:col-span-3 space-y-6">
                        {/* Main Tab Bar: Products | Vouchers */}
                        <div className="flex gap-2 bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-gray-100 dark:border-gray-700 w-fit">
                            {[{ id: 'products', label: 'Sản phẩm', icon: 'inventory_2' }, { id: 'vouchers', label: 'Voucher', icon: 'confirmation_number' }].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id as MainTab)}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Products tab */}
                        {activeTab === 'products' && (
                            <div className="space-y-4">
                                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <form onSubmit={handleSearch} className="relative flex-grow max-w-md">
                                            <input
                                                id="shop-search-input"
                                                type="text"
                                                value={searchInput}
                                                onChange={e => setSearchInput(e.target.value)}
                                                placeholder="Tìm trong cửa hàng..."
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                            />
                                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
                                        </form>

                                        {/* Category filters */}
                                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                                            {['', 'Rau củ', 'Trái cây', 'Đặc sản'].map((cat) => (
                                                <button
                                                    key={cat || 'all'}
                                                    id={`filter-${cat || 'all'}`}
                                                    onClick={() => handleCategory(cat)}
                                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                                                ${activeCategory === cat
                                                            ? 'bg-primary text-white shadow-sm'
                                                            : 'bg-surface-light dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {cat || 'Tất cả'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Grid */}
                                {loadingProducts ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                                        <span className="material-symbols-outlined text-6xl text-gray-300">inventory_2</span>
                                        <p className="font-medium">Không tìm thấy sản phẩm nào.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAddToCart={() => handleAddToCart(product)}
                                                onClick={() => navigate(`/product/${product.id}`)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <nav className="flex items-center gap-2">
                                            <button
                                                id="pagination-prev"
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                            </button>

                                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                                const p = i + 1;
                                                return (
                                                    <button
                                                        key={p}
                                                        id={`pagination-page-${p}`}
                                                        onClick={() => setPage(p)}
                                                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors
                                                    ${page === p
                                                                ? 'bg-primary text-white'
                                                                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                id="pagination-next"
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        )} {/* end products tab */}

                        {/* Vouchers tab */}
                        {activeTab === 'vouchers' && (
                            <div>
                                {voucherLoading ? (
                                    <div className="flex items-center justify-center py-20 text-primary">
                                        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Đang tải voucher...
                                    </div>
                                ) : shopVouchers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                                        <span className="material-symbols-outlined text-6xl text-gray-300">confirmation_number</span>
                                        <p className="font-medium">Cửa hàng chưa có voucher nào.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {shopVouchers.map(v => (
                                            <div key={v.id} className="relative bg-white dark:bg-surface-dark border-2 border-dashed border-primary/30 rounded-2xl overflow-hidden p-5 flex gap-4">
                                                {/* Left discount badge */}
                                                <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-black text-primary">
                                                        {v.loaiGiamGia === 'PHAN_TRAM' ? `${v.giaTriGiam}%` : `${(v.giaTriGiam / 1000).toFixed(0)}k`}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">giảm</span>
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-[#131613] dark:text-white truncate">{v.tenVoucher}</p>
                                                    {v.moTa && <p className="text-xs text-gray-500 truncate">{v.moTa}</p>}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        HSD: {new Date(v.ngayHetHan).toLocaleDateString('vi-VN')}
                                                        {v.giaTriDonHangToiThieu > 0 && ` • Đơn tối thiểu ${v.giaTriDonHangToiThieu.toLocaleString('vi-VN')}₫`}
                                                    </p>
                                                    <p className="text-xs font-bold text-primary mt-1 font-mono">{v.maCode}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {v.soLuongConLai === 9999 ? 'Không giới hạn' : `Còn lại: ${v.soLuongConLai}`}
                                                    </p>
                                                </div>
                                                {/* Claim button */}
                                                <button
                                                    onClick={() => handleClaimVoucher(v.id)}
                                                    disabled={v.daLay || v.soLuongConLai === 0}
                                                    className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${v.daLay
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : v.soLuongConLai === 0
                                                            ? 'bg-red-50 text-red-400 cursor-not-allowed'
                                                            : 'bg-primary text-white hover:bg-[#246328] shadow-sm'
                                                        }`}
                                                >
                                                    {v.daLay ? 'Đã lấy ✓' : v.soLuongConLai === 0 ? 'Hết lượt' : 'Lấy ngay'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <BuyerFooter />

            <BuyerFloatingButtons
                targetSellerId={sellerId}
                targetSellerName={profile?.hoTen}
                targetSellerAvatar={profile?.anhDaiDienUrl}
            />
        </div>
    );
};

interface ProductCardProps {
    product: SellerProduct;
    onAddToCart: () => void;
    onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
    const [fav, setFav] = useState(false);
    const isOutOfStock = product.trangThai === 'HetHang';

    return (
        <div
            className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative flex flex-col cursor-pointer"
        >
            {/* Image */}
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative" onClick={onClick}>
                <img
                    src={product.hinhAnhUrl || PLACEHOLDER_PRODUCT}
                    alt={product.tenHienThi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_PRODUCT; }}
                />

                {/* Blockchain badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                    {product.isGhim && (
                        <div className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-[11px] filled">push_pin</span>
                            Nổi bật
                        </div>
                    )}
                    <div className="bg-green-600/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]">link</span>
                        Blockchain
                    </div>
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-surface-light text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">Hết hàng</span>
                    </div>
                )}

                {/* Favourite */}
                <button
                    id={`fav-${product.id}`}
                    onClick={e => { e.stopPropagation(); setFav(f => !f); }}
                    className="absolute top-2 right-2 bg-surface-light/90 dark:bg-gray-800/80 p-1.5 rounded-full shadow-sm transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                    <span className={`material-symbols-outlined text-[18px] ${fav ? 'filled text-red-500' : 'text-gray-400'}`}>favorite</span>
                </button>
            </div>

            <div className="p-4 flex flex-col flex-grow" onClick={onClick}>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 truncate" title={product.tenHienThi}>
                    {product.tenHienThi}
                </h3>

                {product.tenChatLuong && (
                    <span className="inline-block w-fit text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-semibold mb-2">
                        {product.tenChatLuong}
                    </span>
                )}

                <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={4.5} size={13} />
                    <span className="text-xs text-gray-400">({product.soLuong} còn)</span>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <span className="block font-bold text-base text-primary">
                            {product.gia.toLocaleString('vi-VN')}₫
                            {product.tenDonVi && (
                                <span className="text-xs font-normal text-gray-400"> / {product.tenDonVi}</span>
                            )}
                        </span>
                    </div>
                    <button
                        id={`add-cart-${product.id}`}
                        onClick={e => { e.stopPropagation(); if (!isOutOfStock) onAddToCart(); }}
                        disabled={isOutOfStock}
                        className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerStorefrontPage;
