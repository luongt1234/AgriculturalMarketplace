import { useEffect, useRef } from 'react';
import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
} from '@microsoft/signalr';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5182'}/hubs/order`;

// Map trạng thái đơn hàng → thông báo tiếng Việt
const STATUS_MESSAGES: Record<string, { title: string; message: string }> = {
    ChoXuLy:  { title: '🛒 Đơn hàng chờ xử lý',      message: 'Đơn hàng của bạn đã được đặt thành công và đang chờ người bán xác nhận.' },
    XacNhan:  { title: '✅ Đơn hàng đã xác nhận',     message: 'Người bán đã xác nhận đơn hàng. Chúng tôi sẽ sớm giao hàng cho bạn.' },
    DangGiao: { title: '🚚 Đơn hàng đang giao',        message: 'Đơn hàng của bạn đang trên đường giao. Vui lòng chú ý điện thoại.' },
    DaGiao:   { title: '📦 Đơn hàng đã giao',          message: 'Đơn hàng đã được giao đến địa chỉ của bạn. Hãy xác nhận nếu đã nhận được hàng.' },
    HoanTat:  { title: '🎉 Đơn hàng hoàn tất',         message: 'Đơn hàng đã hoàn tất. Cảm ơn bạn đã mua sắm tại AgroMarket!' },
    Huy:      { title: '❌ Đơn hàng bị hủy',           message: 'Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ hỗ trợ nếu có thắc mắc.' },
};

/**
 * Hook lắng nghe OrderHub (SignalR) và push notification khi đơn hàng thay đổi trạng thái.
 * Chỉ hoạt động khi người dùng đã đăng nhập.
 */
export function useOrderNotifications() {
    const { isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const connRef = useRef<HubConnection | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const token =
            localStorage.getItem('token') ??
            sessionStorage.getItem('token') ??
            '';
        if (!token) return;

        const hub = new HubConnectionBuilder()
            .withUrl(`${HUB_URL}?access_token=${token}`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(LogLevel.Warning)
            .build();

        connRef.current = hub;

        // ── Lắng nghe sự kiện cập nhật đơn hàng ──────────────────────────
        hub.on('OrderStatusUpdated', (orderId: string, newStatus: string) => {
            const cfg = STATUS_MESSAGES[newStatus];
            addNotification({
                type: 'order',
                title: cfg?.title ?? `Đơn hàng cập nhật: ${newStatus}`,
                message: cfg?.message ?? `Đơn hàng #${orderId.slice(0, 8).toUpperCase()} đã được cập nhật.`,
                link: '/orders',
            });
        });

        // ── Lắng nghe thanh toán MoMo thành công ─────────────────────────
        hub.on('PaymentSuccess', (orderId: string) => {
            addNotification({
                type: 'order',
                title: '💳 Thanh toán thành công',
                message: `Thanh toán cho đơn hàng #${orderId.slice(0, 8).toUpperCase()} đã được xác nhận qua MoMo.`,
                link: '/orders',
            });
        });

        // ── Lắng nghe thông báo hệ thống ─────────────────────────────────
        hub.on('SystemNotification', (title: string, message: string) => {
            addNotification({ type: 'system', title, message });
        });

        // ── Khởi động kết nối ─────────────────────────────────────────────
        hub.start().catch((err) => {
            console.warn('[OrderHub] Kết nối thất bại:', err);
        });

        return () => {
            hub.off('OrderStatusUpdated');
            hub.off('PaymentSuccess');
            hub.off('SystemNotification');
            if (connRef.current?.state === HubConnectionState.Connected) {
                connRef.current.stop();
            }
        };
    }, [isAuthenticated, addNotification]);
}
