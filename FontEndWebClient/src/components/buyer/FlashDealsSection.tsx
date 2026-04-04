import React, { useEffect, useState } from 'react';
import { ProductCard } from '../../features/products/components/ProductCard';
import type { BuyerProduct } from '../../types/buyer.types';

interface FlashDealsSectionProps {
    products?: BuyerProduct[];
    onAddToCart?: (product: BuyerProduct) => void;
    title?: string;
}

// Mock data for flash deals
const FLASH_DEALS_PRODUCTS: BuyerProduct[] = [
    {
        id: '1',
        name: 'Organic Tomatoes',
        price: 20000,
        originalPrice: 25000,
        discount: 20,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCybU5rCnrJrAmnuwjJOSUt5m7xcEETO4U8piG2SedI8RrzAYJeIXucDM6ysOijxytsR36LamLKslVZd2Qm4IuYN7T10N4CW9_ytYyCL0cPMchdSEf1znZTSK_cZRNPETTiMTFbwQYZpWaDAe7Q39BkCQjimyPyQLCTHUuUxA7U_Qaek2r4yWUUxcr8_Qvp3FiNRCAHVaKEbS15q7TbnImLvlgKoAdkEKFftx_C6AwmoZRtx6gXqQPDOQ73zCzfQP8jftJczQjZGg',
        rating: 4.8,
        location: 'Dalat Farm',
        seller: 'Dalat Farm',
        unit: '/kg',
        category: 'Vegetable'
    },
    {
        id: '2',
        name: 'Dragon Fruit (White)',
        price: 29750,
        originalPrice: 35000,
        discount: 15,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBW723Am8KPpguyG8UYH5O9aQRewDZ8qDPamm5Ngw2KEh5jb5KI-AqbRc1MxNq0FoHChwl-UfrtNrEIPICIwCSi4gAKnGg1aMM70t8L5Bv1QWilygyuAfGbNXsvUz8l9dPXu5togszqGRWxH81DU0ETN8-X4wGuEYNskAFLuqknrAUW2P4WN7cIokreLH7AMHMkUbDoTUYttmA-YhllsXM9braXyF7DtDzxSGsA_VdVfl6QRbDByxEsBeSYh6qx3SN4AFpSIrC01A',
        rating: 4.9,
        location: 'Binh Thuan',
        seller: 'Binh Thuan Farm',
        unit: '/kg',
        category: 'Fruit'
    },
    {
        id: '3',
        name: 'Fresh Pork Belly',
        price: 126000,
        originalPrice: 140000,
        discount: 10,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCR5ldfXQXjFJ4ohal7krQzQ9q2yUGJA4fe6_7fkt6QUzUDC4RhqUXnvTbT_Xi_ZrhnPE_nZN9CVRU35h0aN42Q1LKyPIfaGcl1g4CpQt03W4AHVUxcpEwBBvd2BLjFcIvauzKfYx3PZuvuX_aHHL8W5u5TE4OYF4EJCUIliBUB43aaEaV2QN14gU6Xu8_lvCIDvqmwohgmhv5r7QjzfvblRl0JwH44Dhr9FswxKWCSABurnnRhB2FFA28jsj7B_dtT_HSu-O5fng',
        rating: 4.5,
        location: 'CP Farm',
        seller: 'CP Farm',
        unit: '/kg',
        category: 'Meat'
    }
];

export const FlashDealsSection: React.FC<FlashDealsSectionProps> = ({
    products = FLASH_DEALS_PRODUCTS,
    onAddToCart,
    title = 'Flash Deals'
}) => {
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Limited time offers</p>
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
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        showDiscount={true}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </div>
    );
};
