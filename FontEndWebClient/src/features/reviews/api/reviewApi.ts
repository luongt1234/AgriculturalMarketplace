import axiosInstance from '../../../lip/axiosInstance';
import type { ReviewSummary, TaoDanhGiaRequest, Review, CoTheDanhGia } from '../types/review.types';

const BASE = '/api/DanhGia';

/**
 * Lấy danh sách + thống kê đánh giá của một sản phẩm (public).
 * axiosInstance interceptor trả về response.data, tức là ApiResponse<T>
 * Nên ta lấy .data từ kết quả đó.
 */
export const getProductReviews = async (
    sanPhamDangId: string,
    page    = 1,
    pageSize = 10,
    filterSao?: number,
): Promise<ReviewSummary> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (filterSao !== undefined) params.filterSao = filterSao;

    const res = await axiosInstance.get<ReviewSummary>(`${BASE}/san-pham/${sanPhamDangId}`, { params });
    return res.data;
};

/**
 * Gửi đánh giá (cần đăng nhập).
 */
export const submitReview = async (req: TaoDanhGiaRequest): Promise<Review> => {
    const res = await axiosInstance.post<Review>(BASE, req);
    return res.data;
};

/**
 * Kiểm tra buyer có thể đánh giá không (cần đăng nhập).
 */
export const checkCanReview = async (
    donHangId: string,
    sanPhamDangId: string,
): Promise<CoTheDanhGia> => {
    const res = await axiosInstance.get<CoTheDanhGia>(`${BASE}/co-the-danh-gia`, {
        params: { donHangId, sanPhamDangId },
    });
    return res.data;
};
