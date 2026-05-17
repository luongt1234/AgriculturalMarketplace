import { useState, useCallback, useEffect } from 'react';
import { getProductReviews } from '../api/reviewApi';
import type { ReviewSummary } from '../types/review.types';

export const useProductReviews = (sanPhamDangId: string) => {
    const [summary, setSummary]       = useState<ReviewSummary | null>(null);
    const [loading, setLoading]       = useState(true);
    const [page, setPage]             = useState(1);
    const [filterSao, setFilterSao]   = useState<number | undefined>(undefined);

    const fetchReviews = useCallback(async (currentPage: number, sao?: number) => {
        try {
            setLoading(true);
            const data = await getProductReviews(sanPhamDangId, currentPage, 10, sao);
            setSummary(data);
        } catch {
            // silently fail – product page still works
        } finally {
            setLoading(false);
        }
    }, [sanPhamDangId]);

    useEffect(() => {
        fetchReviews(page, filterSao);
    }, [fetchReviews, page, filterSao]);

    const handleFilterChange = (sao?: number) => {
        setFilterSao(sao);
        setPage(1);
    };

    const loadMore = () => {
        if (summary && page < summary.tongTrang) {
            setPage((p) => p + 1);
        }
    };

    /** Gọi sau khi submit review thành công để refresh */
    const refresh = () => fetchReviews(1, undefined);

    return { summary, loading, page, filterSao, handleFilterChange, loadMore, refresh };
};
