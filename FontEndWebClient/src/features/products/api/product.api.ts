import axiosInstance from "../../../lip/axiosInstance";

// Interface dữ liệu Form
export interface ProductFormRequest {
    ten_san_pham: string;
    spc_id: string;
    chat_luong_id: string;
    gia: number;
    so_luong: number;
    mo_ta: string;
    hinh_anh: File | null; // Có thể null nếu đang edit và không đổi ảnh
}

// Hàm chuyển object thành FormData
const buildFormData = (data: ProductFormRequest) => {
    const formData = new FormData();
    formData.append('ten_san_pham', data.ten_san_pham);
    formData.append('spc_id', data.spc_id);
    formData.append('chat_luong_id', data.chat_luong_id);
    formData.append('gia', data.gia.toString());
    formData.append('so_luong', data.so_luong.toString());
    formData.append('mo_ta', data.mo_ta || '');
    formData.append('tinh_trang', 'con_hang');

    // Chỉ gửi file nếu người dùng có chọn ảnh mới
    if (data.hinh_anh instanceof File) {
        formData.append('hinh_anh', data.hinh_anh);
    }
    return formData;
};

// API Thêm mới
export const createProduct = async (data: ProductFormRequest) => {
    const formData = buildFormData(data);
    const response = await axiosInstance.post('/api/san-pham-dang', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProduct = async (id: string, data: ProductFormRequest) => {
    const formData = buildFormData(data);
    // Backend cần API endpoint PUT: /api/san-pham-dang/{id}
    const response = await axiosInstance.put(`/api/san-pham-dang/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};