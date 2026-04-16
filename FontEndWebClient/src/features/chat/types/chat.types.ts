// Kiểu dữ liệu cho chức năng Chat

export interface Message {
    id: string;
    nguoiGuiId: string;
    nguoiNhanId: string;
    noiDung: string;
    thoiGian: string;
    trangThai: 'ChuaDoc' | 'DaDoc';
    tenNguoiGui?: string;
    anhDaiDienNguoiGui?: string;
}

export interface Conversation {
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isLastMessageMine: boolean;
}

export interface SendMessagePayload {
    nguoiNhanId: string;
    noiDung: string;
}
