import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../lip/axiosInstance';
import type { DanhMuc } from '../../../types/danhMuc.type';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    danhMucVaiTro?: DanhMuc;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    danhMucVaiTro
}) => {
    const [loading, setLoading] = useState(false);
    console.log({ danhMucVaiTro });

    const [formData, setFormData] = useState({
        tenDangNhap: '',
        matKhau: '',
        hoTen: '',
        email: '',
        soDienThoai: '',
        vaiTroId: danhMucVaiTro?.id,
        diaChi: '',

    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, vaiTroId: danhMucVaiTro?.id }));
    }, [danhMucVaiTro])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/api/NguoiDung', formData);
            toast.success('Thêm mới người dùng thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Lỗi khi thêm người dùng:', error);
            toast.error('Có lỗi xảy ra khi thêm người dùng.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h2 className="text-lg font-bold text-[#131613] dark:text-white uppercase tracking-wide">
                        Thêm mới người mua
                    </h2>
                    <button onClick={onClose} className="text-[#6b806c] hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Tên đăng nhập *</label>
                            <input required name="tenDangNhap" value={formData.tenDangNhap} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Mật khẩu *</label>
                            <input required type="password" name="matKhau" value={formData.matKhau} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Họ và tên *</label>
                            <input required name="hoTen" value={formData.hoTen} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Email *</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50" />
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
                            XÁC NHẬN LƯU
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};