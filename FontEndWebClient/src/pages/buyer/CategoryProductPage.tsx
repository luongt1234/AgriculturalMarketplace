import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { BuyerFloatingButtons } from '../../components/buyer/BuyerFloatingButtons';
import { CategoriesSection } from '../../components/buyer/CategoriesSection';
import { ProductCard } from '../../features/products/components/ProductCard';
import { getDisplayProducts, getCommonProducts } from '../../features/products/api/product.api';
import type { BuyerProduct } from '../../types/buyer.types';
import type { DisplayProduct } from '../../features/products/api/product.api';
import { getImageUrl } from '../../utils/imageUrl';

const mapToBuyerProduct = (p: DisplayProduct): BuyerProduct => ({
    id: p.id,
    name: p.tenHienThi,
    price: p.gia,
    image: getImageUrl(p.hinhAnhUrl),
    rating: 4.5,
    location: 'Việt Nam',
    seller: p.tenNguoiBan,
    unit: `/${p.tenDonVi}`,
    category: p.tenLoai,
});

const SORT_OPTIONS = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
    { value: 'newest', label: 'Mới nhất' },
];

export const CategoryProductPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const [products, setProducts] = useState<BuyerProduct[]>([]);
    const [rawProducts, setRawProducts] = useState<DisplayProduct[]>([]);
    const [categoryName, setCategoryName] = useState('Danh mục');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sortBy, setSortBy] = useState('default');

    const pageSize = 16;

    // Resolve category name from API
    useEffect(() => {
        const fetchCategoryName = async () => {
            if (categoryId === 'all') {
                setCategoryName('Tất cả danh mục');
                return;
            }
            try {
                const data = await getCommonProducts();
                const found = data.find(c => c.id === categoryId);
                if (found) setCategoryName(found.tenSanPham);
            } catch (e) {
                console.error('Failed to fetch category name');
            }
        };
        if (categoryId) fetchCategoryName();
    }, [categoryId]);

    const sortProducts = useCallback((raw: DisplayProduct[], sort: string): BuyerProduct[] => {
        let sorted = [...raw];
        if (sort === 'price_asc') sorted.sort((a, b) => a.gia - b.gia);
        else if (sort === 'price_desc') sorted.sort((a, b) => b.gia - a.gia);
        else if (sort === 'newest') sorted.sort((a, b) => new Date(b.ngayDang).getTime() - new Date(a.ngayDang).getTime());
        return sorted.map(mapToBuyerProduct);
    }, []);

    // Initial load
    useEffect(() => {
        if (!categoryId) return;
        
        if (categoryId === 'all') {
            setLoading(false);
            setProducts([]);
            setRawProducts([]);
            setTotalRecords(0);
            return;
        }

        setLoading(true);
        setProducts([]);
        setRawProducts([]);
        setCurrentPage(1);

        const fetch = async () => {
            try {
                const res = await getDisplayProducts({ pageNumber: 1, pageSize, sanPhamChungId: categoryId });
                const raw: DisplayProduct[] = res.data || [];
                setRawProducts(raw);
                setProducts(sortProducts(raw, sortBy));
                setTotalPages(res.totalPages || 1);
                setTotalRecords(res.totalRecords || 0);
            } catch (e) {
                console.error('Failed to load products', e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    // Re-sort when sort changes (no re-fetch needed for current page)
    useEffect(() => {
        setProducts(sortProducts(rawProducts, sortBy));
    }, [sortBy, rawProducts, sortProducts]);

    const loadMore = async () => {
        if (currentPage >= totalPages || loadingMore || !categoryId) return;
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const res = await getDisplayProducts({ pageNumber: nextPage, pageSize, sanPhamChungId: categoryId });
            const newRaw: DisplayProduct[] = res.data || [];
            const combined = [...rawProducts, ...newRaw];
            setRawProducts(combined);
            setProducts(sortProducts(combined, sortBy));
            setCurrentPage(nextPage);
            setTotalPages(res.totalPages || 1);
        } catch (e) {
            console.error('Failed to load more products', e);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <BuyerHeader cartCount={0} showNavigation={true} />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Trang chủ</button>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{categoryName}</span>
                </nav>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{categoryName}</h1>
                        {!loading && categoryId !== 'all' && (
                            <p className="text-gray-500 text-sm mt-1">
                                Tìm thấy <span className="font-semibold text-primary">{totalRecords}</span> sản phẩm
                            </p>
                        )}
                    </div>

                    {/* Sort */}
                    {categoryId !== 'all' && (
                        <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    )}
                </div>

                {/* Products Grid */}
                {categoryId === 'all' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <CategoriesSection title="" showViewAll={false} onCategoryClick={(c) => navigate(`/category/${c.id}`)} />
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: pageSize }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-xl mb-3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không có sản phẩm nào</h3>
                        <p className="text-gray-500 mb-6">Danh mục này chưa có sản phẩm nào được đăng bán.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    variant="compact"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                />
                            ))}
                        </div>

                        {currentPage < totalPages && (
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loadingMore ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang tải...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                            Xem thêm sản phẩm
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <BuyerFooter />
            <BuyerFloatingButtons />
        </div>
    );
};

export default CategoryProductPage;
