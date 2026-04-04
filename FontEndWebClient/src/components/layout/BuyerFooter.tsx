import React from 'react';

export const BuyerFooter: React.FC = () => {
    return (
        <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nông Sản Việt</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Connecting Vietnamese farmers directly with consumers. Freshness, transparency, and fair prices for everyone.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                                    f
                                </div>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                                    in
                                </div>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                                    ig
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Marketplace Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Marketplace</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    All Products
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Fresh Fruits
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Vegetables
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Meat & Seafood
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Dried Goods
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Our Farmers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Pricing Analytics
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Help & Support</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Shipping Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Returns & Refunds
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© 2024 Nông Sản Việt. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-primary">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-primary">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
