/**
 * Base URL của backend server (dùng cho static files / ảnh upload)
 */
const IMAGE_BASE_URL = 'http://localhost:5182';

/**
 * Trả về URL đầy đủ của ảnh.
 * - Nếu url đã bắt đầu bằng http/https → trả về nguyên
 * - Nếu url là path tương đối (bắt đầu bằng /) → thêm IMAGE_BASE_URL vào trước
 * - Nếu url rỗng hoặc null/undefined → trả về fallback (mặc định là chuỗi rỗng)
 */
export function getImageUrl(url: string | null | undefined, fallback = ''): string {
    if (!url) return fallback;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    return `${IMAGE_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
