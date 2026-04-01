import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lip/axiosInstance';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage = () => {
    const navigate = useNavigate();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = {
                Email: email,
                MatKhau: password
            }

            const res = await axiosInstance.post('/api/auth/login', form);

            if (res.success && res.data) {
                localStorage.setItem('accessToken', res.data.token);
                // localStorage.setItem('refreshToken', res.data.refreshToken);
                toast.success(res.message || "Đăng nhập thành công");
                useAuthStore.getState().login(res.data);

                if (res.data.maVaiTro === 'ADMIN') navigate('/admin');
                else if (res.data.maVaiTro === 'NONG-DAN') navigate('/farmer');
                else navigate('/');

                // navigate('/farmer/dashboard');
            } else {
                toast.error(res.message || "Sai thông tin đăng nhập");
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            toast.error(`Lỗi đăng nhập: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center font-display">
            <div className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">

                {/* Phần Trái: Hình ảnh & Slogan */}
                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-background-dark">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <img
                            alt="Cánh đồng nông nghiệp"
                            className="h-full w-full object-cover"
                            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop" // Thay bằng ảnh thật
                        />
                    </div>
                    <div className="relative z-20 px-12 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-4xl">potted_plant</span>
                            <span className="text-2xl font-black tracking-tight text-white">AgriMarket</span>
                        </div>
                        <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] mb-4">
                            Nền tảng kết nối nông dân, người mua và doanh nghiệp
                        </h1>
                        <p className="text-slate-200 text-lg font-medium max-w-md mx-auto">
                            Thị trường hàng đầu cho nông sản chất lượng cao và vật tư nông nghiệp bền vững.
                        </p>
                    </div>
                    <div className="absolute bottom-8 left-12 z-20">
                        <p className="text-slate-300 text-sm">© 2026 AgriMarket Inc. Đã đăng ký bản quyền.</p>
                    </div>
                </div>

                {/* Phần Phải: Form Đăng nhập */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white dark:bg-background-dark">
                    <div className="w-full max-w-[440px] flex flex-col h-full lg:h-auto">

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 mb-8">
                            <span className="material-symbols-outlined text-primary text-3xl">potted_plant</span>
                            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold">AgriMarket</h2>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold leading-tight tracking-tight mb-2">Chào mừng trở lại</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Vui lòng nhập thông tin để đăng nhập vào hệ thống</p>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            {/* Khung Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email hoặc Tên đăng nhập</label>
                                <input
                                    required
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-slate-400 transition-colors"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>

                            {/* Khung Mật khẩu */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Mật khẩu</label>
                                    <Link to="/forgot-password" className="text-primary text-sm font-bold hover:underline">Quên mật khẩu?</Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 pr-12 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-slate-400 transition-colors"
                                        placeholder="Nhập mật khẩu của bạn"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Nút Đăng nhập */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary h-12 px-5 text-slate-900 text-base font-bold tracking-wide hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        </form>

                        {/* Đường kẻ chia tách */}
                        <div className="relative my-4 flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                            <span className="mx-4 flex-shrink text-slate-400 text-xs font-bold uppercase tracking-widest">Hoặc tiếp tục với</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                        </div>

                        {/* Đăng nhập Mạng xã hội */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button type="button" className="flex flex-1 items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                                </svg>
                                Google
                            </button>
                            <button type="button" className="flex flex-1 items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        {/* Đăng ký */}
                        <div className="mt-10 text-center">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Bạn chưa có tài khoản?
                                <Link to="/register" className="text-primary font-bold hover:underline ml-1">Đăng ký ngay</Link>
                            </p>
                        </div>

                        {/* Footer Form */}
                        <div className="mt-auto pt-10 flex justify-center gap-6 pb-6 lg:pb-0">
                            <Link to="/privacy-policy" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Chính sách bảo mật</Link>
                            <Link to="/terms" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Điều khoản dịch vụ</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};