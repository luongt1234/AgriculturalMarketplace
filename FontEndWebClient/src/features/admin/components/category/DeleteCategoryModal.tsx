import React, { useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../../lip/axiosInstance';
import type { DanhMuc, LoaiDanhMuc } from '../../../../types/danhMuc.type';

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'LOAI_DANH_MUC' | 'DANH_MUC';
    item?: LoaiDanhMuc | DanhMuc | null;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    type,
    item
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!item?.id) return;

        setLoading(true);
        try {
            const endpoint = type === 'LOAI_DANH_MUC' ? '/api/LoaiDanhMuc' : '/api/DanhMuc';
            await axiosInstance.delete(`${endpoint}/${item.id}`);

            const message = type === 'LOAI_DANH_MUC'
                ? 'Xóa loại danh mục thành công!'
                : 'Xóa danh mục thành công!';

            toast.success(message);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.message;
            toast.error(errorMsg || 'Có lỗi xảy ra khi xóa.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !item) return null;

    // Determine display text based on type
    const displayName = type === 'LOAI_DANH_MUC'
        ? (item as LoaiDanhMuc).tenLoaiDanhMuc
        : (item as DanhMuc).tenHienThi;

    const itemLabel = type === 'LOAI_DANH_MUC' ? 'loại danh mục' : 'danh mục';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h2 className="text-lg font-bold text-[#131613] dark:text-white uppercase tracking-wide">
                        Xác nhận xóa
                    </h2>
                    <button onClick={onClose} className="text-[#6b806c] hover:text-red-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500 text-3xl">
                            warning
                        </span>
                        <div>
                            <p className="text-sm text-[#131613] dark:text-white font-medium">
                                Bạn có chắc chắn muốn xóa {itemLabel} này?
                            </p>
                            <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                                Hành động này không thể hoàn tác.
                            </p>
                        </div>
                    </div>

                    {/* Info item */}
                    <div className="mt-4 p-3 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] border border-[#dee3de] dark:border-gray-700">
                        <p className="text-sm font-bold text-[#131613] dark:text-white">
                            {displayName}
                        </p>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400">
                            {type === 'LOAI_DANH_MUC'
                                ? `Mã: ${(item as LoaiDanhMuc).maLoaiDanhMuc}`
                                : `Mã giá trị: ${(item as DanhMuc).maGiaTri}`}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#dee3de] dark:border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg text-sm font-bold text-[#6b806c] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && (
                            <span className="material-symbols-outlined animate-spin text-[18px]">
                                progress_activity
                            </span>
                        )}
                        XÁC NHẬN XÓA
                    </button>
                </div>
            </div>
        </div>
    );
};
