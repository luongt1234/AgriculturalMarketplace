export interface Product {
    id: string;
    tenHienThi?: string;
    tenLoai?: string;
    gia: number;
    soLuong: number;
    tenDonVi?: string;
    trangThai: 'active' | 'out_of_stock' | 'draft' | string;
    hinhAnhUrl?: string;
    ngayDang: string;
    sku?: string;
    moTaChiTiet?: string;
    sanPhamChungId: string;
    tenSanPhamChung?: string;
    nguoiBanId: string;
    tenNguoiBan?: string;
    anhDaiDienNguoiBan?: string;
    chatLuongId?: string;
    tenChatLuong?: string;
    donViId?: string;
    loaiId?: string;
    anhSanPham?: string;
}

// Interface cho Sản Phẩm Chung (CommonProduct) - dạng cây
export interface CommonProduct {
    id: string;
    tenSanPham: string;
    loai_id: string | null;
    moTa: string;
    donViId: string;
    ngayTao: string;
    chaId: string | null;
    children?: CommonProduct[] | null;
}

// Interface cho Chất lượng (Quality)
export interface QualityOption {
    id: string;
    maGiaTri: string;
    tenHienThi: string;
    thuTu: number;
    loaiDanhMuc?: {
        id: string;
        maLoaiDanhMuc: string;
        tenLoaiDanhMuc: string;
    };
}