import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lip/axiosInstance';
import { toast } from 'sonner';

export const RegisterPage = () => {
    const navigate = useNavigate();

    // Quản lý state của Form
    const [formData, setFormData] = useState({
        MaVaiTro: 'THUONG-LAI', // Mặc định là Người mua
        HoVaTen: '',
        Email: '',
        SoDienThoai: '',
        MatKhau: '',
        MatKhauXacNhan: '',
        terms: false
    });

    // Trạng thái ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Xử lý submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate cơ bản
        if (formData.MatKhau !== formData.MatKhauXacNhan) {
            // alert("Mật khẩu nhập lại không khớp!");
            toast.error("Mật khẩu nhập lại không khớp")
            return;
        }

        if (!formData.terms) {
            // alert("Vui lòng đồng ý với Điều khoản dịch vụ!");
            toast.error("Vui lòng đồng ý với Điều khoản dịch vụ");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axiosInstance.post(`/api/auth/register`, formData);

            toast.success("Đăng kí tài khoản thành công");
            navigate('/login');
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            toast.error('Đăng ký thất bại. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-hidden font-display">
            <div className="flex min-h-screen w-full">

                {/* Phần Trái: Hình ảnh & Slogan */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2000&auto=format&fit=crop")' }}
                    ></div>
                    {/* Lớp phủ Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>

                    {/* Nội dung trên ảnh */}
                    <div className="relative z-10 flex flex-col justify-between h-full w-full p-16 text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <svg className="size-8 text-background-dark" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">AgriMarket</span>
                        </div>
                        <div className="max-w-md">
                            <h1 className="text-5xl font-black leading-tight mb-4">Đồng hành cùng người nông dân.</h1>
                            <p className="text-lg text-slate-200">Kết nối trực tiếp nông sản sạch từ nông trại đến hàng ngàn người mua trên toàn quốc. Khởi đầu hành trình thương mại bền vững của bạn tại đây.</p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    <img alt="User 1" className="w-10 h-10 object-cover rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100&auto=format&fit=crop" />
                                    <img alt="User 2" className="w-10 h-10 object-cover rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1589824781471-a48e718cc91e?w=100&auto=format&fit=crop" />
                                    <img alt="User 3" className="w-10 h-10 object-cover rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" />
                                </div>
                                <p className="text-sm font-medium"><span className="text-primary font-bold">12,000+</span> thành viên đã tham gia</p>
                            </div>
                        </div>
                        <div className="text-sm opacity-70">
                            © 2026 AgriMarket Inc. Đã đăng ký bản quyền.
                        </div>
                    </div>
                </div>

                {/* Phần Phải: Form Đăng ký */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white dark:bg-background-dark overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-md space-y-8">
                        {/* Mobile Branding */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="bg-primary p-2 rounded-lg">
                                <svg className="size-6 text-background-dark" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold dark:text-white">AgriMarket</span>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-extrabold tracking-tight dark:text-white">Tạo tài khoản mới</h2>
                            <p className="text-slate-500 dark:text-slate-400">Tham gia cộng đồng và bắt đầu hành trình thương mại của bạn.</p>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Chọn Vai trò */}
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tôi tham gia với vai trò:</p>
                                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
                                    <label className="relative flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="MaVaiTro"
                                            value="THUONG-LAI"
                                            checked={formData.MaVaiTro === 'THUONG-LAI'}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-primary dark:peer-checked:bg-slate-700 text-slate-500 dark:text-slate-400">
                                            <span className="material-symbols-outlined mr-2 text-[20px]">shopping_basket</span>
                                            Người mua (Thương lái)
                                        </div>
                                    </label>
                                    <label className="relative flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="MaVaiTro"
                                            value="NONG-DAN"
                                            checked={formData.MaVaiTro === 'NONG-DAN'}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-primary dark:peer-checked:bg-slate-700 text-slate-500 dark:text-slate-400">
                                            <span className="material-symbols-outlined mr-2 text-[20px]">agriculture</span>
                                            Người bán (Nông dân)
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Khung Nhập liệu */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Họ và tên đại diện</label>
                                    <input
                                        required
                                        id="HoVaTen"
                                        name="HoVaTen"
                                        type="text"
                                        value={formData.HoVaTen}
                                        onChange={handleChange}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors focus:ring-0 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Địa chỉ Email</label>
                                    <input
                                        required
                                        id="Email"
                                        name="Email"
                                        type="email"
                                        value={formData.Email} onChange={handleChange}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors focus:ring-0 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Số điện thoại</label>
                                    <input
                                        required
                                        id="SoDienThoai"
                                        name="SoDienThoai"
                                        type="tel"
                                        value={formData.SoDienThoai} onChange={handleChange}
                                        placeholder="0912 345 678"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors focus:ring-0 focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                required
                                                id="MatKhau"
                                                name="MatKhau"
                                                type={showPassword ? "text" : "password"}
                                                value={formData.MatKhau}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors focus:ring-0 focus:border-primary focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Xác nhận mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                required
                                                id="MatKhauXacNhan"
                                                name="MatKhauXacNhan"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.MatKhauXacNhan}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors focus:ring-0 focus:border-primary focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms" name="terms" type="checkbox" required
                                        checked={formData.terms} onChange={handleChange}
                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                                        Tôi đồng ý với{' '}
                                        <Link to="/terms" className="text-primary hover:underline font-bold">Điều khoản dịch vụ</Link>
                                        {' '}và{' '}
                                        <Link to="/privacy-policy" className="text-primary hover:underline font-bold">Chính sách bảo mật</Link>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 gap-2 items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đăng ký tài khoản'
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-background-dark text-slate-500 font-medium">Hoặc đăng ký bằng</span>
                                </div>
                            </div>

                            {/* Social Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                    </svg>
                                    Google
                                </button>
                                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined text-[20px] text-blue-600">account_circle</span>
                                    Dùng thử
                                </button>
                            </div>

                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6 pb-6 lg:pb-0">
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="font-bold text-primary hover:underline transition-all">Đăng nhập tại đây</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};