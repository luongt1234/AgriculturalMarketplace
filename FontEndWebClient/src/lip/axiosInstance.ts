import axios from 'axios';
import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig
} from 'axios';

const API_BASE_URL = 'http://localhost:5182';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    errors: any | null;
    pageNumber: number | null;
    pageSize: number | null;
    totalRecords: number | null;
    totalPages: number | null;
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData && config.headers) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;

                        try {
                            const refreshToken = localStorage.getItem('refreshToken');

                            if (refreshToken) {
                                const response = await axiosInstance.post('/auth/refresh', {
                                    refreshToken
                                });

                                const newAccessToken = response.data.token;
                                localStorage.setItem('accessToken', newAccessToken);

                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                                }
                                return axiosInstance(originalRequest);
                            }
                        } catch (refreshError) {
                            console.error('Refresh token thất bại');
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        }
                    }

                    console.error('Lỗi 401: Chưa xác thực.');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    break;

                case 403:
                    console.error('Lỗi 403: Không có quyền truy cập.');
                    break;

                case 404:
                    console.error('Lỗi 404: Không tìm thấy tài nguyên.');
                    break;

                case 422:
                    console.error('Lỗi 422: Dữ liệu không hợp lệ.', data);
                    break;

                case 500:
                    console.error('Lỗi 500: Lỗi máy chủ nội bộ.');
                    break;

                case 502:
                case 503:
                case 504:
                    console.error(`Lỗi ${status}: Máy chủ không khả dụng.`);
                    break;

                default:
                    console.error(`Lỗi HTTP ${status}:`, data);
            }
        } else if (error.request) {
            console.error('Lỗi mạng:', error.request);
        } else {
            console.error('Lỗi request:', error.message);
        }

        return Promise.reject(error);
    }
);

interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
}

// Ép kiểu khi export
export default axiosInstance as CustomAxiosInstance;