import React, { useEffect, useState } from 'react';
import type { Category } from '../../types/buyer.types';
import { getCommonProducts } from '../../features/products/api/product.api';
import type { CommonProduct } from '../../types/product.types';

interface CategoriesSectionProps {
    title?: string;
    showViewAll?: boolean;
    onCategoryClick?: (category: Partial<Category> & { id: string, name: string }) => void;
}

const colorClasses = [
    'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500',
    'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
];

const iconsList = ['eco', 'nutrition', 'set_meal', 'local_florist', 'spa', 'grass', 'forest', 'agriculture'];

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
    title = 'Khám phá danh mục',
    showViewAll = true,
    onCategoryClick
}) => {
    const [categories, setCategories] = useState<{ id: string, name: string, icon: string, bgColor: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCommonProducts();
                // Filter only root elements (chaId is null) or just take the first level
                const rootCategories = data.filter(c => !c.chaId);
                
                const mapped = rootCategories.map((c, index) => ({
                    id: c.id,
                    name: c.tenSanPham,
                    icon: iconsList[index % iconsList.length],
                    bgColor: colorClasses[index % colorClasses.length]
                }));
                setCategories(mapped);
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

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

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : categories.length === 0 ? (
                <p className="text-gray-500 italic">Không có danh mục nào.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick?.(category)}
                            className="group flex flex-col items-center justify-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-transparent hover:border-primary/30 shadow-sm hover:shadow-soft transition-all duration-200 text-center"
                        >
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${category.bgColor}`}
                            >
                                <span className="material-symbols-outlined text-[32px]">
                                    {category.icon}
                                </span>
                            </div>
                            <span className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2">
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};
