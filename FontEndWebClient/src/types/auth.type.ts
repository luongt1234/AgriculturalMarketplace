export interface User {
    id: string;
    tenDangNhap: string | null;
    hoTen: string;
    email: string;
    soDienThoai: string;
    anhDaiDienUrl: string | null;
    vaiTroId: string;
    tenVaiTro: string;
    soDu: number;
    maVaiTro: string | null;
}

export interface LoginData extends User {
    token: string;
}