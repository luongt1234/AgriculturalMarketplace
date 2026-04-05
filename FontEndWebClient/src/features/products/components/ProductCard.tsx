import React, { useState } from 'react';
import type { BuyerProduct } from '../../../types/buyer.types';

interface ProductCardProps {
    product: BuyerProduct;
    showDiscount?: boolean;
    onAddToCart?: (product: BuyerProduct) => void;
    variant?: 'default' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    showDiscount = true,
    onAddToCart,
    variant = 'default'
}) => {
    const [isFavorite, setIsFavorite] = useState(false);

    if (variant === 'compact') {
        return (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group relative">
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={product.image}
                    />
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`absolute top-3 right-3 bg-white/90 dark:bg-gray-800/80 p-2 rounded-full shadow-sm transition-colors backdrop-blur-sm z-10 ${isFavorite ? 'text-red-500' : 'text-gray-400 dark:text-white hover:text-red-500'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'filled' : ''}`}>
                            favorite
                        </span>
                    </button>
                </div>
                <div className="p-4">
                    <div className="text-xs text-green-600 font-bold mb-1 uppercase tracking-wide">
                        {product.category}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 truncate">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 truncate">{product.location}</p>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                            {product.price.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-xs text-gray-400">{product.unit}</span>
                    </div>
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="w-full mt-3 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group relative">
            <div className="absolute top-3 left-3 z-10">
                {showDiscount && product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                    </span>
                )}
            </div>
            <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 shadow-sm backdrop-blur-sm transition-all ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
            >
                <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'filled' : ''}`}>
                    favorite
                </span>
            </button>

            <div className="aspect-[4/3] bg-gray-200 w-full overflow-hidden">
                <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.image}
                />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                        {product.name}
                    </h4>
                    <div className="flex items-center text-amber-400 text-xs font-bold whitespace-nowrap ml-2">
                        <span className="material-symbols-outlined text-[16px] mr-0.5">star</span>
                        {product.rating}
                    </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
                    {product.location}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <span className="material-symbols-outlined text-[14px] mr-1">storefront</span>
                    {product.seller}
                </p>

                <div className="flex items-end justify-between">
                    <div>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                {product.originalPrice.toLocaleString('vi-VN')}₫
                            </span>
                        )}
                        <div className="text-lg font-bold text-primary">
                            {product.price.toLocaleString('vi-VN')}₫{' '}
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                {product.unit}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors"
                        title="Thêm vào giỏ"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
