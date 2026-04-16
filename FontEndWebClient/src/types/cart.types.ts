export interface CartItemDto {
    id: string;
    sanPhamDangId: string;
    tenSanPham?: string;
    hinhAnhUrl?: string;
    gia: number;
    soLuong: number;
    donVi?: string;
    nguoiBanId: string;
    tenNguoiBan?: string;
    thanhTien: number;
}

export interface CartDto {
    id: string;
    nguoiDungId: string;
    chiTiet: CartItemDto[];
    tongTien: number;
}

export interface AddToCartDto {
    sanPhamDangId: string;
    soLuong: number;
}

export interface UpdateQuantityDto {
    soLuong: number;
}