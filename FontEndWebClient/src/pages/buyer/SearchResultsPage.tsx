import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { ProductCard } from '../../features/products/components/ProductCard';
import { getDisplayProducts, type DisplayProduct } from '../../features/products/api/product.api';
import type { BuyerProduct } from '../../types/buyer.types';

export const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [products, setProducts] = useState<DisplayProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // Include basic keyword filter, expand with other filters if API supported later
            const res = await getDisplayProducts({ keyword, pageNumber: 1, pageSize: 50 });
            setProducts(res.data?.data || res.data || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [keyword]);

    const mapToBuyerProduct = (p: DisplayProduct): BuyerProduct => ({
        id: p.id,
        name: p.tenHienThi,
        price: p.gia,
        originalPrice: p.gia * 1.1,
        rating: 4.5,
        location: 'Hà Nội',
        seller: p.tenNguoiBan || 'Người bán',
        image: p.hinhAnhUrl ? `http://localhost:5000${p.hinhAnhUrl}` : 'https://placehold.co/400x300?text=Product',
        unit: p.tenDonVi || '/kg',
        category: p.tenSanPhamChung || 'Nông sản',
        discount: 0
    });

    const handleApplyFilter = () => {
        let list = [...products];
        if (minPrice) list = list.filter(p => p.gia >= parseInt(minPrice));
        if (maxPrice) list = list.filter(p => p.gia <= parseInt(maxPrice));
        setProducts(list);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <BuyerHeader showNavigation={true} />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Kết quả tìm kiếm cho: "{keyword}"
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Tìm thấy {products.length} sản phẩm</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">filter_list</span>
                                Bộ lọc
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Khoảng giá (₫)</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="TỪ"
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-1 focus:ring-primary"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="ĐẾN"
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleApplyFilter}
                                    className="w-full py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center p-12">
                                <span className="text-primary font-medium">Đang tìm kiếm...</span>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        product={mapToBuyerProduct(p)}
                                        onClick={() => navigate(`/product/${p.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy sản phẩm nào</h3>
                                <p className="text-gray-500">Thử thay đổi từ khóa hoặc xóa bớt bộ lọc để có thêm kết quả.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <BuyerFooter />
        </div>
    );
};

export default SearchResultsPage;
