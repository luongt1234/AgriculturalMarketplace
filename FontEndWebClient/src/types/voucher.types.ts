export type LoaiVoucher = 'HE_THONG' | 'CUA_HANG';
export type LoaiGiamGia = 'PHAN_TRAM' | 'SO_TIEN_CO_DINH';

export interface VoucherDto {
    id: string;
    maCode: string;
    tenVoucher: string;
    moTa?: string;
    loaiVoucher: LoaiVoucher;
    loaiGiamGia: LoaiGiamGia;
    giaTriGiam: number;
    giaTriGiamToiDa?: number;
    giaTriDonHangToiThieu: number;
    ngayBatDau: string;
    ngayHetHan: string;
    soLuong: number;
    soLuongDaDung: number;
    nguoiBanId?: string;
    tenNguoiBan?: string;
    apDungChoIds?: string;
    conHieuLuc: boolean;
    conSoLuong: boolean;
}

export interface CreateVoucherDto {
    maCode: string;
    tenVoucher: string;
    moTa?: string;
    loaiGiamGia: LoaiGiamGia;
    giaTriGiam: number;
    giaTriGiamToiDa?: number;
    giaTriDonHangToiThieu: number;
    ngayBatDau: string;
    ngayHetHan: string;
    soLuong: number;
    apDungChoIds?: string;
}

export interface UpdateVoucherDto {
    tenVoucher: string;
    moTa?: string;
    giaTriGiam: number;
    giaTriGiamToiDa?: number;
    giaTriDonHangToiThieu: number;
    ngayBatDau: string;
    ngayHetHan: string;
    soLuong: number;
    apDungChoIds?: string;
}

export interface VoucherPublicDto {
    id: string;
    maCode: string;
    tenVoucher: string;
    moTa?: string;
    loaiGiamGia: LoaiGiamGia;
    giaTriGiam: number;
    giaTriGiamToiDa?: number;
    giaTriDonHangToiThieu: number;
    ngayHetHan: string;
    soLuongConLai: number;
    daLay: boolean;
}

export interface ValidateVoucherResultDto {
    hopLe: boolean;
    loiMessage?: string;
    voucherId?: string;
    loaiGiamGia?: LoaiGiamGia;
    soTienGiam: number;
    giaTriDonHangSauGiam: number;
}
