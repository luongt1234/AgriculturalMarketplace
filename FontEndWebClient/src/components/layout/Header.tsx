import React from 'react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e0e6e0] bg-white dark:bg-[#1a2e1a] px-4 sm:px-10 py-3 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl">eco</span>
                    </div>
                    <h2 className="text-gray-900 dark:text-white text-xl font-extrabold tracking-tight">
                        PeachyMarket
                    </h2>
                </div>
            </div>

            <nav className="hidden md:flex gap-8">
                {['Marketplace', 'My Orders', 'Analytics', 'Traceability'].map((item) => (
                    <a key={item} href="#" className="text-sm font-medium hover:text-[#13ec13] transition-colors dark:text-gray-200">
                        {item}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full bg-[#f0f4f0] dark:bg-[#2a402a] dark:text-white">
                    <span className="material-symbols-outlined">shopping_cart</span>
                </button>
                <div className="size-10 rounded-full border-2 border-primary bg-cover" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=a')` }}></div>
            </div>
        </header>
    );
};

export default Header;