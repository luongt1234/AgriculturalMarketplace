import React, { useState } from 'react';
import { toast } from 'sonner';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { FlashDealsSection } from '../../components/buyer/FlashDealsSection';
import { FreshArrivalsSection } from '../../components/buyer/FreshArrivalsSection';
import { BuyerFloatingButtons } from '../../components/buyer/BuyerFloatingButtons';
import type { BuyerProduct } from '../../types/buyer.types';

export const FeaturedProductsPage = () => {
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = (product: BuyerProduct) => {
        setCartCount((prev) => prev + 1);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <BuyerHeader cartCount={cartCount} showNavigation={true} />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <span className="material-symbols-outlined text-3xl">local_fire_department</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            Sản phẩm nổi bật
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Tổng hợp các sản phẩm ưu đãi & gợi ý dành cho bạn
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />

                {/* Flash Deals Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500">bolt</span>
                            Ưu đãi nổi bật
                        </h2>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            Giới hạn thời gian
                        </span>
                    </div>
                    <FlashDealsSection
                        title="Ưu đãi nhanh"
                        onAddToCart={handleAddToCart}
                    />
                </section>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* Fresh Arrivals / All Products Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">storefront</span>
                            Tất cả sản phẩm
                        </h2>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            Cập nhật liên tục
                        </span>
                    </div>
                    <FreshArrivalsSection
                        title=""
                        onAddToCart={handleAddToCart}
                    />
                </section>
            </main>

            <BuyerFooter />
            <BuyerFloatingButtons />
        </div>
    );
};

export default FeaturedProductsPage;
