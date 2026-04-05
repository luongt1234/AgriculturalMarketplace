import axiosInstance from "../../../lip/axiosInstance";
import type { CommonProduct, Product, QualityOption } from "../../../types/product.types";

// Interface dữ liệu Form chuẩn hóa theo cấu trúc Backend (SanPhamDangDto)
export interface ProductFormRequest {
    tenHienThi: string;      // Thay cho ten_san_pham
    sanPhamChungId: string;  // Thay cho spc_id
    chatLuongId?: string;    // Có thể optional tùy logic nghiệp vụ
    gia: number;
    soLuong: number;
    moTaChiTiet: string;     // Thay cho mo_ta
    trangThai?: string;      // Tình trạng: còn hàng, hết hàng...
    hinhAnh: File | null;    // File upload
}

// Hàm chuyển object thành FormData để gửi multipart/form-data
const buildFormData = (data: ProductFormRequest) => {
    const formData = new FormData();

    // Nối các trường text vào FormData
    formData.append('tenHienThi', data.tenHienThi);
    formData.append('sanPhamChungId', data.sanPhamChungId);

    // Nếu có chọn chất lượng thì mới append (tránh gửi string rỗng lên C# Guid gây lỗi)
    if (data.chatLuongId) {
        formData.append('chatLuongId', data.chatLuongId);
    }

    formData.append('gia', data.gia.toString());
    formData.append('soLuong', data.soLuong.toString());
    formData.append('moTaChiTiet', data.moTaChiTiet || '');

    // Đặt giá trị mặc định nếu form không gửi lên
    formData.append('trangThai', data.trangThai || 'con_hang');

    // Chỉ đính kèm file nếu người dùng thực sự chọn ảnh mới
    if (data.hinhAnh instanceof File) {
        formData.append('hinhAnh', data.hinhAnh); // Backend C# cần có prop: public IFormFile? HinhAnh { get; set; }
    }

    return formData;
};

// API Thêm mới sản phẩm đăng
export const createProduct = async (data: ProductFormRequest) => {
    const formData = buildFormData(data);
    const response = await axiosInstance.post('/api/SanPhamDang', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// API Cập nhật sản phẩm đăng
export const updateProduct = async (id: string, data: ProductFormRequest) => {
    const formData = buildFormData(data);
    const response = await axiosInstance.put(`/api/SanPhamDang/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// API Lấy danh sách sản phẩm chung (dạng cây)
export const getCommonProducts = async (): Promise<CommonProduct[]> => {
    const response = await axiosInstance.get('/api/SanPhamChung/get-tree');
    return response.data || [];
};

// API Lấy danh sách chất lượng
export const getQualityOptions = async (): Promise<QualityOption[]> => {
    const response = await axiosInstance.get('/api/DanhMuc/GetByMaLoaiDanhMuc/DANH-MUC-CHAT-LUONG');
    return response.data || [];
};

// API Lấy danh sách sản phẩm đăng của người dùng (có phân trang)
export interface GetProductsParams {
    pageNumber?: number;
    pageSize?: number;
}

export interface ProductsResponse {
    data: Product[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
}

export const getProducts = async (params?: GetProductsParams) => {
    const queryString = new URLSearchParams();
    if (params?.pageNumber !== undefined) queryString.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize !== undefined) queryString.append('pageSize', params.pageSize.toString());

    const response = await axiosInstance.get(`/api/SanPhamDang/user?${queryString.toString()}`);
    return response || {
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0
    };
};

// API Lấy chi tiết sản phẩm
export const getProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/api/SanPhamDang/${id}`);
    return response.data;
};

// API Xóa sản phẩm đăng
export const deleteProduct = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/SanPhamDang/${id}`);
};

// Interface cho sản phẩm hiển thị
export interface DisplayProduct {
    id: string;
    tenHienThi: string;
    gia: number;
    soLuong: number;
    trangThai: string;
    hinhAnhUrl: string;
    moTaChiTiet: string;
    ngayDang: string;
    sanPhamChungId: string;
    nguoiBanId: string;
    chatLuongId: string;
    tenSanPhamChung: string;
    tenNguoiBan: string;
    anhDaiDienNguoiBan: string | null;
    tenChatLuong: string;
    donViId: string;
    tenDonVi: string;
    loaiId: string;
    tenLoai: string;
    anhSanPham: string | null;
    displayScore: number;
    isFeatured: boolean;
}

// API Lấy danh sách sản phẩm hiển thị (cho buyer)
export interface GetDisplayProductsParams {
    pageNumber?: number;
    pageSize?: number;
}

export interface DisplayProductsResponse {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    success: boolean;
    message: string;
    data: DisplayProduct[];
    errors: any | null;
}

export const getDisplayProducts = async (params?: GetDisplayProductsParams) => {
    const queryString = new URLSearchParams();
    if (params?.pageNumber !== undefined) queryString.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize !== undefined) queryString.append('pageSize', params.pageSize.toString());

    return await axiosInstance.get(`/api/SanPhamDang/display?${queryString.toString()}`);
};