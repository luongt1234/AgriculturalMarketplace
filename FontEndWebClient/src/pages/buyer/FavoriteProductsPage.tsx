import React, { useEffect } from 'react';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { ProductCard } from '../../features/products/components/ProductCard';
import type { BuyerProduct } from '../../types/buyer.types';
import { useNavigate } from 'react-router-dom';

export const FavoriteProductsPage = () => {
    const { favorites, loading, error, fetchFavorites } = useFavoriteStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <BuyerHeader cartCount={0} showNavigation={true} />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-500 text-3xl filled">favorite</span>
                        Sản phẩm yêu thích
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-8 bg-red-50 rounded-xl">
                        <p>{error}</p>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">heart_broken</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Danh sách trống</h3>
                        <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và lưu lại những sản phẩm ưng ý nhé!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
                            Khám phá ngay
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {favorites.map((fav) => {
                            const product: BuyerProduct = {
                                id: fav.sanPhamDangId,
                                name: fav.tenHienThi,
                                price: fav.gia,
                                image: `http://localhost:5182${fav.hinhAnhUrl}`,
                                category: '',
                                location: 'Việt Nam',
                                seller: fav.tenCuaHang,
                                unit: '',
                                rating: 0
                            };
                            return (
                                <ProductCard
                                    key={fav.sanPhamYeuThichId}
                                    product={product}
                                    variant="default"
                                    onClick={() => navigate(`/Product/${product.id}`)}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            <BuyerFooter />
        </div>
    );
};

export default FavoriteProductsPage;
