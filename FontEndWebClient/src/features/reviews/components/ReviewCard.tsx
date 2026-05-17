import React from 'react';
import { ReviewStars } from './ReviewStars';
import type { Review } from '../types/review.types';

interface ReviewCardProps {
    review: Review;
    baseUrl?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, baseUrl = '' }) => {
    const avatarUrl = review.anhDaiDienUrl
        ? review.anhDaiDienUrl.startsWith('http')
            ? review.anhDaiDienUrl
            : `${baseUrl}${review.anhDaiDienUrl}`
        : null;

    const initials = review.tenNguoiDanhGia
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0].toUpperCase())
        .join('');

    const timeAgo = (() => {
        const diffMs   = Date.now() - new Date(review.ngayTao).getTime();
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return '1 ngày trước';
        if (diffDays < 30) return `${diffDays} ngày trước`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
        return `${Math.floor(diffDays / 365)} năm trước`;
    })();

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={review.tenNguoiDanhGia} className="w-full h-full object-cover" />
                    ) : (
                        <span>{initials || '?'}</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{review.tenNguoiDanhGia}</h4>
                        <span className="text-xs text-gray-400">• {timeAgo}</span>
                    </div>
                    <ReviewStars rating={review.soSao} size="sm" />
                </div>
            </div>

            {review.binhLuan && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed ml-13 pl-[52px]">
                    {review.binhLuan}
                </p>
            )}
        </div>
    );
};
