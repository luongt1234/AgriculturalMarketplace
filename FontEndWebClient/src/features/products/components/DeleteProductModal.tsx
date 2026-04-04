import React, { useState } from 'react';
import { toast } from 'sonner';
import { deleteProduct } from '../api/product.api';
import type { Product } from '../../../types/product.types';

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: Product | null;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    product
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!product?.id) return;

        setLoading(true);
        try {
            await deleteProduct(product.id);
            toast.success('Xóa sản phẩm thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi xóa sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                                Bạn có chắc chắn muốn xóa sản phẩm này?
                            </p>
                            <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                                Hành động này không thể hoàn tác.
                            </p>
                        </div>
                    </div>

                    {/* Info product */}
                    <div className="mt-4 p-3 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] border border-[#dee3de] dark:border-gray-700">
                        <p className="text-sm font-bold text-[#131613] dark:text-white">
                            {product?.tenHienThi}
                        </p>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                            SKU: {product?.sku || 'N/A'}
                        </p>
                        <p className="text-xs text-[#6b806c] dark:text-gray-400">
                            Giá: {product?.gia.toLocaleString('vi-VN')} ₫
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
