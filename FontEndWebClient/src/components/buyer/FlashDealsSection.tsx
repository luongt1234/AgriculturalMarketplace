import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../../features/products/components/ProductCard';
import type { BuyerProduct } from '../../types/buyer.types';

interface FlashDealsSectionProps {
    onAddToCart?: (product: BuyerProduct) => void;
    title?: string;
}

// Giống nông sản cố định với hình ảnh thực tế
const FLASH_DEALS_PRODUCTS: BuyerProduct[] = [
    {
        id: 'giong-ca-chua-bi',
        name: 'Giống cà chua bi Cherry (Giống TN148)',
        price: 20000,
        originalPrice: 25000,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
        rating: 4.8,
        location: 'Đà Lạt, Lâm Đồng',
        seller: 'Nông trại Đà Lạt',
        unit: '/gói 50 hạt',
        category: 'Giống rau'
    },
    {
        id: 'giong-dua-hau-khong-hat',
        name: 'Giống dưa hấu không hạt (Giống Rado 689)',
        price: 35000,
        originalPrice: 45000,
        discount: 22,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
        rating: 4.7,
        location: 'Tiền Giang',
        seller: 'Viện Cây ăn quả MN',
        unit: '/gói 20 hạt',
        category: 'Giống trái cây'
    },
    {
        id: 'giong-ot-canh-f1',
        name: 'Giống ớt cánh F1 Cháy Đỏ (Giống TN557)',
        price: 32000,
        originalPrice: 40000,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80',
        rating: 4.7,
        location: 'TP. Hồ Chí Minh',
        seller: 'Trang Nông Seeds',
        unit: '/gói 50 hạt',
        category: 'Giống rau'
    },
];

export const FlashDealsSection: React.FC<FlashDealsSectionProps> = ({
    onAddToCart,
    title = 'Ưu đãi nhanh'
}) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({
        hours: 4,
        minutes: 23,
        seconds: 12
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 23;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ưu đãi giống nông sản trong thời gian giới hạn</p>
                    </div>
                </div>
                {/* Countdown Timer */}
                <div className="flex items-center gap-2">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-lg px-3 py-1.5 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                        {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <span className="font-bold text-gray-400">:</span>
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-lg px-3 py-1.5 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <span className="font-bold text-gray-400">:</span>
                    <div className="bg-white dark:bg-gray-800 text-red-600 font-mono font-bold text-lg px-3 py-1.5 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FLASH_DEALS_PRODUCTS.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        showDiscount={true}
                        onAddToCart={onAddToCart}
                        onClick={() => navigate(`/sanPham/${product.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};