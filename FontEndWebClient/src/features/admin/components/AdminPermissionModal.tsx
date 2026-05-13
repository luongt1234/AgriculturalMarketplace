import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { NguoiDung } from '../../../types/nguoiDung.type';
import { adminPermissionsApi } from '../api/adminPermissionsApi';
import type { AdminFeaturePermission, AdminPermissionCode } from '../constants/adminPermissions';

interface AdminPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: NguoiDung | null;
}

export const AdminPermissionModal: React.FC<AdminPermissionModalProps> = ({
    isOpen,
    onClose,
    user,
}) => {
    const [features, setFeatures] = useState<AdminFeaturePermission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<AdminPermissionCode[]>([]);
    const [loadingPerms, setLoadingPerms] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load danh sách chức năng (1 lần)
    useEffect(() => {
        adminPermissionsApi.getFeatures()
            .then(setFeatures)
            .catch(() => toast.error('Không thể tải danh sách chức năng'));
    }, []);

    // Load quyền của user mỗi khi modal mở / user thay đổi
    useEffect(() => {
        if (!isOpen || !user) return;
        setLoadingPerms(true);
        adminPermissionsApi.getUserPermissions(user.id)
            .then(setSelectedPermissions)
            .catch(() => toast.error('Không thể tải quyền của tài khoản'))
            .finally(() => setLoadingPerms(false));
    }, [isOpen, user]);

    const togglePermission = (code: AdminPermissionCode) => {
        setSelectedPermissions(prev =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === features.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(features.map(f => f.code));
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await adminPermissionsApi.updateUserPermissions(user.id, selectedPermissions);
            toast.success(`Đã cập nhật quyền cho ${user.hoTen}`);
            onClose();
        } catch {
            toast.error('Không thể cập nhật phân quyền');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setSelectedPermissions([]);
        onClose();
    };

    if (!isOpen || !user) return null;

    const allSelected = features.length > 0 && selectedPermissions.length === features.length;
    const someSelected = selectedPermissions.length > 0 && !allSelected;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-md rounded-2xl shadow-2xl flex flex-col border border-[#dee3de] dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90vh]">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21] rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-[20px]">rule_settings</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-[#131613] dark:text-white truncate">
                                {user.hoTen}
                            </p>
                            <p className="text-[11px] text-[#6b806c] dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-[#6b806c] hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 shrink-0 ml-2"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* ── Title bar ───────────────────────────────────────── */}
                <div className="px-5 py-3 border-b border-[#dee3de] dark:border-gray-700 flex items-center justify-between shrink-0">
                    <p className="text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase tracking-wide">
                        Cấu hình quyền chức năng
                    </p>
                    {/* Chọn tất cả */}
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs font-semibold text-primary hover:underline"
                    >
                        {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                </div>

                {/* ── Permission List ──────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                    {loadingPerms ? (
                        <div className="flex items-center justify-center py-8 gap-2 text-primary">
                            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                            <span className="text-sm">Đang tải quyền...</span>
                        </div>
                    ) : features.length === 0 ? (
                        <p className="text-sm text-center text-[#6b806c] py-8">
                            Không tìm thấy chức năng nào.
                        </p>
                    ) : (
                        features.map((feature) => {
                            const checked = selectedPermissions.includes(feature.code);
                            return (
                                <label
                                    key={feature.code}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                                        checked
                                            ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                                            : 'border-[#dee3de] dark:border-gray-700 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => togglePermission(feature.code)}
                                        className="size-4 accent-primary rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-semibold text-[#131613] dark:text-white">
                                            {feature.label}
                                        </span>
                                        <p className="text-[10px] text-[#6b806c] dark:text-gray-400 font-mono mt-0.5">
                                            {feature.code}
                                        </p>
                                    </div>
                                    {checked && (
                                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                                            check_circle
                                        </span>
                                    )}
                                </label>
                            );
                        })
                    )}
                </div>

                {/* ── Summary + Footer ─────────────────────────────────── */}
                <div className="px-5 py-4 border-t border-[#dee3de] dark:border-gray-700 shrink-0 space-y-3 rounded-b-2xl bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <p className="text-xs text-[#6b806c] dark:text-gray-400">
                        Đã chọn <span className="font-bold text-primary">{selectedPermissions.length}</span>
                        /{features.length} chức năng
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-[#6b806c] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            disabled={saving || loadingPerms}
                            onClick={handleSave}
                            className="px-5 py-2 rounded-xl bg-primary hover:bg-[#246328] text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {saving && (
                                <span className="material-symbols-outlined animate-spin text-[16px]">
                                    progress_activity
                                </span>
                            )}
                            Lưu quyền
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
