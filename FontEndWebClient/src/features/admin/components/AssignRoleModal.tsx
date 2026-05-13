import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../lip/axiosInstance';
import type { NguoiDung } from '../../../types/nguoiDung.type';

// ── Danh sách vai trò có thể phân ──────────────────────────────────────────────
const ROLES = [
    {
        ma: 'THUONG-LAI',
        label: 'Người mua',
        description: 'Tài khoản thương lái, doanh nghiệp thu mua nông sản.',
        icon: 'shopping_cart',
        color: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400',
        activeColor: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/30',
    },
    {
        ma: 'NONG-DAN',
        label: 'Người bán (Nông dân)',
        description: 'Tài khoản nông dân / người bán hàng nông sản trên sàn.',
        icon: 'agriculture',
        color: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400',
        activeColor: 'ring-2 ring-green-500 border-green-500 bg-green-50 dark:bg-green-900/30',
    },
    {
        ma: 'ADMIN',
        label: 'Quản trị viên',
        description: 'Toàn quyền quản lý hệ thống, người dùng và cấu hình.',
        icon: 'admin_panel_settings',
        color: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-400',
        activeColor: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/30',
    },
];

interface AssignRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: NguoiDung | null;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    user,
}) => {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Prefill vai trò hiện tại của user
    useEffect(() => {
        if (user && isOpen) {
            setSelectedRole(user.tenVaiTro || '');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedRole) return;
        if (selectedRole === user.tenVaiTro) {
            toast.info('Vai trò không thay đổi.');
            onClose();
            return;
        }

        setLoading(true);
        try {
            // Lấy vaiTroId từ API danh mục theo mã vai trò
            const danhMucRes = await axiosInstance.get(`/api/DanhMuc/GetByMaGiaTri/${selectedRole}`);
            const vaiTroId: string = danhMucRes.data?.id;
            if (!vaiTroId) throw new Error('Không tìm thấy ID vai trò');

            // Cập nhật vaiTroId cho user
            await axiosInstance.put(`/api/NguoiDung/${user.id}`, {
                ...user,
                vaiTroId,
                tenVaiTro: selectedRole,
            });

            toast.success(`Đã phân quyền "${ROLES.find(r => r.ma === selectedRole)?.label}" cho ${user.hoTen}!`);
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi phân quyền.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    const currentRole = ROLES.find(r => r.ma === user.tenVaiTro);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-200">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-gradient-to-r from-violet-600 to-purple-700">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[20px]">manage_accounts</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">Phân quyền người dùng</h2>
                            <p className="text-violet-200 text-[11px]">Thay đổi vai trò hệ thống</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
                    {/* ── User Info ───────────────────────────────────── */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        {user.anhDaiDienUrl ? (
                            <img src={user.anhDaiDienUrl} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow" />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                {user.hoTen?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-bold text-[#131613] dark:text-white text-sm truncate">{user.hoTen}</p>
                            <p className="text-[11px] text-[#6b806c] dark:text-gray-400 truncate">{user.email}</p>
                            {currentRole && (
                                <span className={`mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRole.color}`}>
                                    <span className="material-symbols-outlined text-[11px]">{currentRole.icon}</span>
                                    {currentRole.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── Role Selector ────────────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wide">
                            Chọn vai trò mới
                        </label>
                        <div className="space-y-2">
                            {ROLES.map(role => {
                                const isSelected = selectedRole === role.ma;
                                const isCurrent = user.tenVaiTro === role.ma;
                                return (
                                    <button
                                        key={role.ma}
                                        type="button"
                                        onClick={() => setSelectedRole(role.ma)}
                                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                                            isSelected
                                                ? role.activeColor + ' dark:border-opacity-80'
                                                : 'border-[#dee3de] dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#253326]'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${role.color}`}>
                                            <span className="material-symbols-outlined text-[18px]">{role.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#131613] dark:text-white">{role.label}</span>
                                                {isCurrent && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase">
                                                        Hiện tại
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#6b806c] dark:text-gray-400 mt-0.5 leading-relaxed">{role.description}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                            isSelected ? 'border-current bg-current' : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-white text-[12px]">check</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Warning ─────────────────────────────────────── */}
                    {selectedRole && selectedRole !== user.tenVaiTro && (
                        <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                            <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">warning</span>
                            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                                Thao tác này sẽ thay đổi quyền truy cập của người dùng ngay lập tức. Hãy chắc chắn trước khi xác nhận.
                            </p>
                        </div>
                    )}

                    {/* ── Footer ──────────────────────────────────────── */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#dee3de] dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl text-sm font-bold text-[#6b806c] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedRole || selectedRole === user.tenVaiTro}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading
                                ? <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Đang xử lý...</>
                                : <><span className="material-symbols-outlined text-[16px]">check_circle</span>Xác nhận phân quyền</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
