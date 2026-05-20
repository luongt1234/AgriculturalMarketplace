import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SellerProfile } from '../api/storefront.api';
import { getImageUrl } from '../../../utils/imageUrl';

interface StoreCardProps {
    store: SellerProfile;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
    const navigate = useNavigate();

    return (
        <div
            className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => navigate(`/shop/${store.id}`)}
        >
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                {store.anhDaiDienUrl ? (
                    <img
                        src={getImageUrl(store.anhDaiDienUrl)}
                        alt={store.hoTen}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="material-symbols-outlined text-gray-400 text-3xl">storefront</span>
                )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors" title={store.hoTen}>
                    {store.hoTen}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5" title={store.moTaCuaHang || 'Gian hàng uy tín'}>
                    {store.moTaCuaHang || 'Gian hàng uy tín'}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1 font-medium text-yellow-600 dark:text-yellow-500">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        {store.diemUyTin || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                        {store.soSanPham || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {store.soNguoiTheoDoi || 0}
                    </span>
                </div>
            </div>

            {/* <div className="hidden sm:flex flex-shrink-0">
                <button 
                    className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white dark:hover:text-gray-900 rounded-full text-sm font-semibold transition-colors flex items-center gap-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shop/${store.id}`);
                    }}
                >
                    Xem
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div> */}
        </div>
    );
};
