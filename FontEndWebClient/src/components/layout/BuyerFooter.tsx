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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">PeachyMarket</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Kết nối nông dân Việt Nam với người tiêu dùng. Tươi ngon, minh bạch và giá cả công bằng cho mọi nhà.
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
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Chợ</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Tất cả sản phẩm
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Trái cây tươi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Rau củ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Thịt & Hải sản
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Thực phẩm khô
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Công ty</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="/about" className="hover:text-primary transition-colors">
                                    Về chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Nông dân của chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Phân tích giá
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Tuyển dụng
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
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Hỗ trợ</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Chính sách giao hàng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Đổi trả & Hoàn tiền
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Câu hỏi thường gặp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    Liên hệ hỗ trợ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© 2026 PeachyMarket. Bảo lưu mọi quyền.</p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="/privacy-policy" className="hover:text-primary">
                            Chính sách bảo mật
                        </a>
                        <a href="/terms-of-service" className="hover:text-primary">
                            Điều khoản dịch vụ
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
