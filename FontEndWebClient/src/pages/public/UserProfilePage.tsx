import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';

export const UserProfilePage = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    // Protective check just in case, though the route is protected
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 mb-4 dark:text-gray-400">Vui lòng đăng nhập để xem hồ sơ</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition font-semibold"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmrqlq18oih4CNLC6LUhf_qcrLZNtkbQEWbCe8yWG4Vtcb3ab7q4Q3DZ3-gzyr7idsugWlYxUKIHLdvdoiilCz3i_FDAc9OaSRjFtXepMhtMwjrmWnCXOpClSSPmrnpOg0ZGH5J4XLJF6kGwf51ad3AXDgmf_6oKxt1WOUF1giE_M3-WljuyERX2Ir4jiRtErV3C27cCSsYpq2owbSoqFSSW36VLPqZkvKN2m0zgtbt-2hnzt5DaCpCdOL-LUkmI7Sid3OaZM4dg';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background-dark">
            <BuyerHeader />
            
            <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header Banner - Lighter Green/Primary theme */}
                    <div className="h-32 bg-gradient-to-r from-emerald-500 to-primary"></div>
                    
                    {/* Profile Information Container */}
                    <div className="px-6 sm:px-8 pb-8 relative">
                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6 gap-6">
                            <div className="relative">
                                <img
                                    src={user.anhDaiDienUrl || defaultAvatar}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md bg-white dark:bg-gray-700"
                                />
                                <button className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full shadow border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                            </div>
                            
                            <div className="flex-1 text-center sm:text-left mb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user.hoTen}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    {user.tenVaiTro}
                                </p>
                            </div>

                            <div className="mb-2 w-full sm:w-auto flex flex-col items-center sm:items-end">
                                <button 
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors w-full justify-center sm:w-auto"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            
                            {/* Personal Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                        Thông tin cá nhân
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Tên đăng nhập</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.tenDangNhap || 'Không có'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.soDienThoai}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Wallet and Account Settings */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                                        Ví & Bảo mật
                                    </h3>
                                    
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-900/30 flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-green-700 dark:text-green-400 font-medium">Số dư khả dụng</p>
                                            <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                                                {user.soDu?.toLocaleString('vi-VN')}₫
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-white dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-200 shadow-sm">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <button className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg hover:border-primary cursor-pointer transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">lock</span>
                                                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors text-sm">Đổi mật khẩu</span>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                                        </button>
                                        <button className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg hover:border-primary cursor-pointer transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">location_on</span>
                                                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors text-sm">Sổ địa chỉ</span>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            
            <BuyerFooter />
        </div>
    );
};

export default UserProfilePage;
