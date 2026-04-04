import React, { useState } from 'react';
import { toast } from 'sonner';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { HeroBanner } from '../../components/buyer/HeroBanner';
import { CategoriesSection } from '../../components/buyer/CategoriesSection';
import { FlashDealsSection } from '../../components/buyer/FlashDealsSection';
import { FreshArrivalsSection } from '../../components/buyer/FreshArrivalsSection';
import type { BuyerProduct, Category } from '../../types/buyer.types';

export const BuyerPage = () => {
    const [cartCount, setCartCount] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddToCart = (product: BuyerProduct) => {
        setCartCount((prev) => prev + 1);
        toast.success(`${product.name} added to cart!`);
    };

    const handleCategoryClick = (category: Category) => {
        toast.info(`Viewing ${category.name} category`);
        // Navigate to category page or filter products
    };

    const handleHeroBannerClick = () => {
        toast.info('Redirecting to shop...');
        // Navigate to shop/products page
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        // Implement search logic if needed
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <BuyerHeader
                cartCount={cartCount}
                showNavigation={true}
                onSearchChange={handleSearchChange}
            />

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
                {/* Hero Banner */}
                <HeroBanner
                    title="Fresh Lục Ngạn Lychees\nHarvested This Morning"
                    subtitle="Direct from Farm"
                    description="Experience the sweetness of premium Vietnamese lychees. Directly sourced from certified farmers in Bac Giang province."
                    imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCpy2mZAcN5k6BzX_bURHyi3XojFDm1o-Gnx38QJopkLMz2EqKfHDGt7LHFLC41xw6TyrqvLVrjU4kwQCSmPthQ52mXKZtB9RgpReLKgGwiskVB0S5PGURESydMoHJVIv9QRIb-uiI90HKRXRlTzogTVAewTAMrXXq5wJGsbfJ3zfJ2dBakZs7veYoTG7g5pgDnABlLHz_DMoaLgH1CX7_xQq5RvF2-YgVUe1J5K_X7PWnMl7OS5_tPepeyS4Sbjhny1QptTPF-VA"
                    ctaText="Shop Now"
                    ctaSecondaryText="Learn More"
                    onCtaClick={handleHeroBannerClick}
                />

                {/* Categories Section */}
                <CategoriesSection
                    title="Explore Categories"
                    showViewAll={true}
                    onCategoryClick={handleCategoryClick}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Flash Deals - Main Section */}
                    <div className="lg:col-span-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Today's Highlights
                        </h3>
                        <FlashDealsSection
                            title="Flash Deals"
                            onAddToCart={handleAddToCart}
                        />
                    </div>

                    {/* Market Price Watch - Sidebar */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <span className="material-symbols-outlined text-xl">
                                            analytics
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        Market Price Watch
                                    </h3>
                                </div>
                                <select className="text-xs bg-gray-100 dark:bg-gray-800 border-none rounded-md py-1.5 px-3 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary cursor-pointer font-medium">
                                    <option>Rice ST25 (Paddy)</option>
                                    <option>Pork (Live Weight)</option>
                                    <option>Robusta Coffee</option>
                                </select>
                            </div>

                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                        Current Volatility
                                    </p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white">
                                            22,500₫
                                        </span>
                                        <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded flex items-center">
                                            <span className="material-symbols-outlined text-[14px] mr-0.5">
                                                trending_down
                                            </span>
                                            -2.4%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Avg. price per kg (National Index)
                                    </p>
                                </div>

                                {/* Placeholder Chart */}
                                <div className="mt-6 relative h-40 w-full bg-gradient-to-b from-transparent to-green-50/50 dark:to-green-900/10 rounded-lg border-b border-gray-200 dark:border-gray-700">
                                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none py-2">
                                        <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                                        <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                                        <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                    <svg
                                        className="absolute inset-0 w-full h-full overflow-visible"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M0,80 C20,70 50,90 80,60 C110,30 140,50 180,40 C220,30 260,60 300,55"
                                            fill="none"
                                            stroke="#2f7f34"
                                            strokeWidth="3"
                                            vectorEffect="non-scaling-stroke"
                                        ></path>
                                        <circle
                                            cx="300"
                                            cy="55"
                                            fill="#2f7f34"
                                            r="5"
                                            stroke="white"
                                            strokeWidth="2"
                                            className="animate-pulse"
                                        ></circle>
                                        <path
                                            d="M0,80 C20,70 50,90 80,60 C110,30 140,50 180,40 C220,30 260,60 300,55 L300,160 L0,160 Z"
                                            fill="url(#gradient)"
                                            opacity="0.15"
                                        ></path>
                                        <defs>
                                            <linearGradient
                                                id="gradient"
                                                x1="0%"
                                                x2="0%"
                                                y1="0%"
                                                y2="100%"
                                            >
                                                <stop
                                                    offset="0%"
                                                    style={{
                                                        stopColor: '#2f7f34',
                                                        stopOpacity: 1
                                                    }}
                                                ></stop>
                                                <stop
                                                    offset="100%"
                                                    style={{
                                                        stopColor: '#2f7f34',
                                                        stopOpacity: 0
                                                    }}
                                                ></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2.5 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                                View Full Price Report
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Fresh Arrivals Section */}
                <FreshArrivalsSection
                    title="Fresh Arrivals"
                    onAddToCart={handleAddToCart}
                />
            </main>

            {/* Footer */}
            <BuyerFooter />
        </div>
    );
};

export default BuyerPage;
