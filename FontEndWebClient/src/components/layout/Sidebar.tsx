import React, { useState } from 'react';

const Sidebar = ({ onFilterChange }) => {
    // State quản lý bộ lọc
    const [filters, setFilters] = useState({
        categories: ['Grains'],
        priceRange: [1.5, 12.0],
        region: 'Latin America',
        grade: 'Grade A'
    });

    // Hàm xử lý khi thay đổi checkbox category
    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];

        const updatedFilters = { ...filters, categories: newCategories };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters); // Gửi dữ liệu lên Marketplace.jsx
    };

    return (
        <aside className="w-full md:w-80 bg-white dark:bg-[#1a2e1a] border-r border-[#e0e6e0] dark:border-[#2a402a] flex-shrink-0">
            <div className="p-6 sticky top-[73px] max-h-[calc(100vh-73px)] overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">Filters</h2>
                        <p className="text-xs text-[#618961]">Refine results by attributes</p>
                    </div>
                    <button
                        className="text-xs font-medium text-[#13ec13] hover:text-green-600"
                        onClick={() => setFilters({ categories: [], priceRange: [0, 100], region: '', grade: '' })}
                    >
                        Reset All
                    </button>
                </div>

                {/* Category Filter - Dựa trên bảng danh_muc trong CSDL */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 dark:text-white">
                        <span className="material-symbols-outlined text-[18px]">category</span> Category
                    </h3>
                    <div className="space-y-2">
                        {['Grains & Cereals', 'Fresh Fruits', 'Vegetables', 'Legumes', 'Coffee & Cocoa'].map((cat) => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(cat)}
                                    onChange={() => handleCategoryChange(cat)}
                                    className="h-5 w-5 rounded border-gray-300 text-[#13ec13] focus:ring-[#13ec13]/50"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#13ec13] transition-colors">
                                    {cat}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 dark:text-white">
                        <span className="material-symbols-outlined text-[18px]">payments</span> Price Range ($/kg)
                    </h3>
                    <div className="px-2">
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.5"
                            className="w-full h-1 bg-[#dbe6db] rounded-full appearance-none cursor-pointer accent-[#13ec13]"
                            onChange={(e) => setFilters({ ...filters, priceRange: [0, e.target.value] })}
                        />
                        <div className="flex justify-between mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <div className="bg-gray-100 dark:bg-[#2a402a] px-2 py-1 rounded">$0.00</div>
                            <div className="bg-gray-100 dark:bg-[#2a402a] px-2 py-1 rounded">${filters.priceRange[1]}</div>
                        </div>
                    </div>
                </div>

                {/* Quality Grade Filter - Tương ứng trường chat_luong_id trong bảng san_pham_dang */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 dark:text-white">
                        <span className="material-symbols-outlined text-[18px]">verified</span> Quality Grade
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['Grade A', 'Grade B', 'Grade C'].map((grade) => (
                            <button
                                key={grade}
                                onClick={() => setFilters({ ...filters, grade })}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filters.grade === grade
                                    ? 'bg-[#13ec13] text-[#111811]'
                                    : 'bg-[#f0f4f0] dark:bg-[#2a402a] text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="w-full bg-[#13ec13] hover:bg-[#10d910] text-[#111811] font-bold py-3 px-4 rounded-lg shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                    onClick={() => onFilterChange(filters)}
                >
                    <span className="material-symbols-outlined">filter_list</span>
                    Apply Filters
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;