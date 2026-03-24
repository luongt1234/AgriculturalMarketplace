export interface NguoiDung {
    id: string;
    hoTen: string;
    email: string;
    soDienThoai?: string;
    diaChi?: string;
    anhDaiDienUrl?: string;

    thongTinNganHang?: string;

    soDu: number;
    soDuChoXuLy: number;

    vaiTroId: string;
    tenVaiTro?: string;

    diemUyTin: number;
    kichHoat: boolean;
    ngayTao?: string;        // DateTime → string (ISO)
    ngayChinhSua?: string;   // DateTime → string (ISO)
}