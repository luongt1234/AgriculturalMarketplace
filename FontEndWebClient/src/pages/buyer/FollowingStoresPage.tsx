import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { StoreCard } from '../../features/sellerStorefront/components/StoreCard';
import { getFollowedStores, type SellerProfile } from '../../features/sellerStorefront/api/storefront.api';

export const FollowingStoresPage = () => {
    const [stores, setStores] = useState<SellerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await getFollowedStores(1, 50);
            const storesData = res.data || (res as any).data?.data || [];
            setStores(storesData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <BuyerHeader cartCount={0} showNavigation={true} />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl filled">storefront</span>
                        Gian hàng đang theo dõi
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                        <p>{error}</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">store_off</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Danh sách trống</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Bạn chưa theo dõi gian hàng nào. Hãy khám phá thêm để lưu lại các gian hàng yêu thích nhé!</p>
                        <button
                            onClick={() => navigate('/search')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
                            Tìm kiếm gian hàng
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>
                )}
            </main>

            <BuyerFooter />
        </div>
    );
};

export default FollowingStoresPage;
