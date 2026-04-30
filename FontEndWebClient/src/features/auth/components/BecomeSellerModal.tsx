import React, { useState } from 'react';
import axiosInstance from '../../../lip/axiosInstance';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from 'sonner';

interface BecomeSellerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BecomeSellerModal: React.FC<BecomeSellerModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAuthStore();

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.put('/api/NguoiDung/register-seller');
            toast.success('Đăng ký thành công! Vui lòng đăng nhập lại để kích hoạt quyền bán hàng.', { duration: 5000 });
            onClose();
            // Đăng xuất để JWT mới được cấp với role NONG-DAN
            setTimeout(() => {
                logout();
                window.location.href = '/login';
            }, 1500);
        } catch (error: unknown) {
            const msg =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Đăng ký thất bại. Vui lòng thử lại.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-white dark:bg-[#1a261c] rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header gradient */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-white text-4xl">agriculture</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Trở thành Người bán</h2>
                    <p className="text-green-100 text-sm mt-1">Kênh nông dân – PeachyMarket</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        Khi xác nhận, tài khoản của bạn sẽ được nâng cấp thành{' '}
                        <strong>Người bán (Nông dân)</strong>. Bạn sẽ có thể:
                    </p>
                    <ul className="space-y-2">
                        {[
                            { icon: 'storefront', text: 'Mở gian hàng và đăng sản phẩm' },
                            { icon: 'local_shipping', text: 'Quản lý đơn hàng và giao hàng' },
                            { icon: 'sell', text: 'Tạo voucher khuyến mãi cho shop' },
                            { icon: 'bar_chart', text: 'Xem thống kê doanh thu' },
                        ].map(({ icon, text }) => (
                            <li key={text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 flex gap-2 items-start text-xs text-amber-800 dark:text-amber-300">
                        <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">info</span>
                        <span>
                            Sau khi xác nhận, bạn sẽ được đăng xuất tự động để cập nhật quyền truy cập mới.
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Xác nhận đăng ký
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
