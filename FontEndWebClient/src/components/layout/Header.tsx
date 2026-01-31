import React from 'react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e0e6e0] bg-white dark:bg-[#1a2e1a] px-4 sm:px-10 py-3 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="size-8 text-[#13ec13]">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C24 24 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold dark:text-white">AgriChain</h2>
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