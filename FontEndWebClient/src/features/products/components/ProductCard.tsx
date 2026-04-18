import React from 'react';
import type { BuyerProduct } from '../../../types/buyer.types';

import { useFavoriteStore } from '../../../store/useFavoriteStore';
import { toast } from 'sonner';

interface ProductCardProps {
    product: BuyerProduct;
    showDiscount?: boolean;
    onAddToCart?: (product: BuyerProduct) => void;
    onClick?: () => void;
    variant?: 'default' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    showDiscount = true,
    onAddToCart,
    onClick,
    variant = 'default'
}) => {
    const { toggleFavorite, isFavorite } = useFavoriteStore();
    const isFav = isFavorite(product.id.toString());

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleFavorite(product.id.toString());
            if (isFav) {
                toast.info('Đã bỏ yêu thích sản phẩm');
            } else {
                toast.success('Đã thêm sản phẩm vào danh sách yêu thích');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thay đổi yêu thích');
        }
    };

    if (variant === 'compact') {
        return (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group relative cursor-pointer" onClick={onClick}>
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={product.image}
                    />
                    <button
                        onClick={handleToggleFavorite}
                        className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-gray-800/80 rounded-full shadow-sm transition-colors backdrop-blur-sm z-10 ${isFav ? 'text-red-500' : 'text-gray-400 dark:text-white hover:text-red-500'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isFav ? 'filled' : ''}`}>
                            favorite
                        </span>
                    </button>
                    {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold z-20">
                        Xem chi tiết
                    </div> */}
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
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group relative cursor-pointer" onClick={onClick}>
            <div className="absolute top-3 left-3 z-10">
                {showDiscount && product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                    </span>
                )}
            </div>
            <button
                onClick={handleToggleFavorite}
                className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-gray-800/80 rounded-full shadow-sm transition-colors backdrop-blur-sm z-10 ${isFav ? 'text-red-500' : 'text-gray-400 dark:text-white hover:text-red-500'
                    }`}
            >
                <span className={`material-symbols-outlined text-[20px] ${isFav ? 'filled' : ''}`}>
                    favorite
                </span>
            </button>

            <div className="aspect-[4/3] bg-gray-200 w-full overflow-hidden relative">
                <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.image}
                />
                {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold z-20">
                    Xem chi tiết
                </div> */}
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
                </div>
            </div>
        </div>
    );
};
