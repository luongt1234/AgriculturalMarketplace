export interface LoaiDanhMuc {
    id: string; // BaseEntity
    maLoaiDanhMuc: string;
    tenLoaiDanhMuc: string;
}

export interface DanhMuc {
    id: string; // BaseEntity
    loaiDanhMucId: string;
    maGiaTri: string;
    danhMucCapTrenId?: string | null;
    tenHienThi: string;
    thuTu: number;
    loaiDanhMuc?: LoaiDanhMuc;
    danhMucCapTren?: DanhMuc;
}