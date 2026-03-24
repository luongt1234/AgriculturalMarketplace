import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../lip/axiosInstance';
import type { NguoiDung } from '../../../types/nguoiDung.type';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: NguoiDung | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    user
}) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
        diaChi: '',
        kichHoat: true
    });

    // Load dữ liệu của user vào form khi mở Modal
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                hoTen: user.hoTen || '',
                email: user.email || '',
                soDienThoai: user.soDienThoai || '',
                diaChi: user.diaChi || '',
                kichHoat: user.kichHoat !== undefined ? user.kichHoat : true,
            });
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Xử lý ép kiểu cho trường boolean (kichHoat)
        if (name === 'kichHoat') {
            setFormData(prev => ({ ...prev, [name]: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // Gửi request PUT kèm ID user. Gộp dữ liệu user cũ với dữ liệu form mới.
            await axiosInstance.put(`/api/NguoiDung/${user.id}`, {
                ...user,
                hoTen: formData.hoTen,
                soDienThoai: formData.soDienThoai,
                diaChi: formData.diaChi,
                kichHoat: formData.kichHoat
            });

            toast.success('Cập nhật người dùng thành công!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h2 className="text-lg font-bold text-[#131613] dark:text-white uppercase tracking-wide">
                        Chỉnh sửa người mua
                    </h2>
                    <button onClick={onClose} className="text-[#6b806c] hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Email (Tài khoản)</label>
                            {/* Disabled field để không cho sửa email */}
                            <input disabled value={formData.email} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 cursor-not-allowed outline-none" />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Trạng thái *</label>
                            <select name="kichHoat" value={formData.kichHoat.toString()} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
                                <option value="true">Hoạt động</option>
                                <option value="false">Khóa tài khoản</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Họ và tên *</label>
                            <input required name="hoTen" value={formData.hoTen} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Số điện thoại</label>
                            <input name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Địa chỉ</label>
                            <input name="diaChi" value={formData.diaChi} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#dee3de] dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-bold text-[#6b806c] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-primary hover:bg-[#246328] text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                            CẬP NHẬT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};