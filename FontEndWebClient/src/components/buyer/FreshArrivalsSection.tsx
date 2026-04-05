import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../features/products/components/ProductCard';
import type { BuyerProduct } from '../../types/buyer.types';
import { getDisplayProducts, type DisplayProduct } from '../../features/products/api/product.api';

interface FreshArrivalsSectionProps {
    products?: BuyerProduct[];
    onAddToCart?: (product: BuyerProduct) => void;
    title?: string;
}

// Hàm chuyển đổi DisplayProduct thành BuyerProduct
const mapDisplayProductToBuyerProduct = (product: DisplayProduct): BuyerProduct => ({
    id: product.id,
    name: product.tenHienThi,
    price: product.gia,
    image: `http://localhost:5182${product.hinhAnhUrl}`, // Giả sử base URL
    rating: 4.5, // Mặc định vì API không có
    location: 'Việt Nam', // Mặc định
    seller: product.tenNguoiBan,
    unit: `/${product.tenDonVi}`,
    category: product.tenLoai
});

export const FreshArrivalsSection: React.FC<FreshArrivalsSectionProps> = ({
    products: propProducts,
    onAddToCart,
    title = 'Gợi ý hôm nay'
}) => {
    const [products, setProducts] = useState<BuyerProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    useEffect(() => {
        if (propProducts) {
            setProducts(propProducts);
            setLoading(false);
        } else {
            const fetchProducts = async () => {
                try {
                    const response = await getDisplayProducts({ pageNumber: 1, pageSize: 10 });
                    const mappedProducts = response.data.map(mapDisplayProductToBuyerProduct);
                    setProducts(mappedProducts);
                    setTotalPages(response.totalPages || 1);
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [propProducts]);

    const loadMore = async () => {
        if (currentPage >= totalPages || loadingMore) return;
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const response = await getDisplayProducts({ pageNumber: nextPage, pageSize: 10 });
            const mappedProducts = response.data.map(mapDisplayProductToBuyerProduct);
            setProducts(prev => [...prev, ...mappedProducts]);
            setCurrentPage(nextPage);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) {
        return (
            <section className="pb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                            <div className="bg-gray-300 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="pb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        variant="compact"
                        onAddToCart={onAddToCart}
                        showDiscount={false}
                    />
                ))}
            </div>
            {currentPage < totalPages && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        // Thay blue bằng green, thêm transition, shadow và hiệu ứng khi click
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow active:scale-95 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loadingMore ? (
                            <>
                                {/* SVG Spinner cho trạng thái loading */}
                                <svg
                                    className="w-5 h-5 animate-spin text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang tải...</span>
                            </>
                        ) : (
                            'Xem thêm'
                        )}
                    </button>
                </div>
            )}
        </section>
    );
};
