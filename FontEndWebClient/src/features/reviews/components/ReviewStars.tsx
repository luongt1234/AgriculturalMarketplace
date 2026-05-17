import React from 'react';

interface ReviewStarsProps {
    rating: number;
    /** Nếu true: click để chọn sao; nếu false: hiển thị tĩnh */
    interactive?: boolean;
    onRate?: (value: number) => void;
    size?: 'sm' | 'md' | 'lg';
    hoverRating?: number;
    onHover?: (value: number) => void;
    onLeave?: () => void;
}

const sizeMap = { sm: 'text-[14px]', md: 'text-[20px]', lg: 'text-[26px]' };

export const ReviewStars: React.FC<ReviewStarsProps> = ({
    rating,
    interactive = false,
    onRate,
    size = 'md',
    hoverRating,
    onHover,
    onLeave,
}) => {
    const display = hoverRating ?? rating;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`material-symbols-outlined ${sizeMap[size]} transition-colors ${
                        star <= display
                            ? 'text-amber-400 fill-1'
                            : 'text-gray-300 dark:text-gray-600'
                    } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                    onClick={() => interactive && onRate?.(star)}
                    onMouseEnter={() => interactive && onHover?.(star)}
                    onMouseLeave={() => interactive && onLeave?.()}
                    aria-label={`${star} sao`}
                >
                    star
                </span>
            ))}
        </div>
    );
};
