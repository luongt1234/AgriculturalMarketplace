import React, { useState } from 'react';
import { toast } from 'sonner';
import { submitReview } from '../api/reviewApi';
import { ReviewStars } from './ReviewStars';
import type { TaoDanhGiaRequest } from '../types/review.types';

interface WriteReviewModalProps {
    sanPhamDangId: string;
    donHangId: string;
    productName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
    sanPhamDangId,
    donHangId,
    productName,
    onClose,
    onSuccess,
}) => {
    const [soSao, setSoSao]       = useState(5);
    const [hoverSao, setHoverSao] = useState(0);
    const [binhLuan, setBinhLuan] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const starLabels = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

    const handleSubmit = async () => {
        if (soSao < 1 || soSao > 5) {
            toast.error('Vui lòng chọn số sao từ 1 đến 5');
            return;
        }

        try {
            setSubmitting(true);
            const req: TaoDanhGiaRequest = { donHangId, sanPhamDangId, soSao, binhLuan: binhLuan.trim() || undefined };
            await submitReview(req);
            toast.success('Cảm ơn bạn đã đánh giá!');
            onSuccess();
            onClose();
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err?.message ?? 'Không thể gửi đánh giá';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                className="relative bg-white dark:bg-[#1a261c] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Đánh giá sản phẩm</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Star selector */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <ReviewStars
                            rating={soSao}
                            interactive
                            size="lg"
                            hoverRating={hoverSao || soSao}
                            onRate={setSoSao}
                            onHover={setHoverSao}
                            onLeave={() => setHoverSao(0)}
                        />
                    </div>
                    <p className="text-sm font-semibold text-amber-500 min-h-[20px]">
                        {starLabels[(hoverSao || soSao) - 1] ?? ''}
                    </p>
                </div>

                {/* Comment */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bình luận <span className="text-gray-400 font-normal">(tùy chọn)</span>
                    </label>
                    <textarea
                        value={binhLuan}
                        onChange={(e) => setBinhLuan(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100
                                   placeholder:text-gray-400 resize-none outline-none
                                   focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-gray-400 text-right mt-1">{binhLuan.length}/500</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-600
                                   text-sm font-medium text-gray-600 dark:text-gray-300
                                   hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark
                                   text-sm font-bold text-white transition-colors
                                   disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </div>
            </div>
        </div>
    );
};
