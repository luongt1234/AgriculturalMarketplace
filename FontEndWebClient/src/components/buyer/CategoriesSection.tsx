import React from 'react';
import type { Category } from '../../types/buyer.types';

interface CategoriesSectionProps {
    title?: string;
    showViewAll?: boolean;
    onCategoryClick?: (category: Category) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
    {
        id: '1',
        name: 'Rau củ',
        icon: 'nutrition',
        color: 'green',
        href: '/buyer/category/vegetables'
    },
    {
        id: '2',
        name: 'Trái cây',
        icon: 'eco',
        color: 'orange',
        href: '/buyer/category/fruits'
    },
    {
        id: '3',
        name: 'Thịt & Gia cầm',
        icon: 'restaurant',
        color: 'red',
        href: '/buyer/category/meat'
    },
    {
        id: '4',
        name: 'Gạo & Ngũ cốc',
        icon: 'grass',
        color: 'yellow',
        href: '/buyer/category/rice'
    },
    {
        id: '5',
        name: 'Thực phẩm khô',
        icon: 'inventory_2',
        color: 'amber',
        href: '/buyer/category/dried'
    }
];

const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500'
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
    title = 'Khám phá danh mục',
    showViewAll = true,
    onCategoryClick
}) => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                {showViewAll && (
                    <a href="#" className="text-primary font-semibold text-sm hover:underline flex items-center">
                        Xem tất cả
                        <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                    </a>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {DEFAULT_CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryClick?.(category)}
                        className="group flex flex-col items-center justify-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-transparent hover:border-primary/30 shadow-sm hover:shadow-soft transition-all duration-200 text-center"
                    >
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${colorClasses[category.color as keyof typeof colorClasses]
                                }`}
                        >
                            <span className="material-symbols-outlined text-[32px]">
                                {category.icon}
                            </span>
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
};
