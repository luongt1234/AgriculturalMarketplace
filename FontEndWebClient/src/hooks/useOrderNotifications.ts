import { useEffect, useRef } from 'react';
import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
} from '@microsoft/signalr';
import { toast } from 'sonner';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';

const HUB_URL = `${import.meta.env.VITE_ORDER_HUB_URL ?? '/hubs/order'}`;

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

        const token = useAuthStore.getState().token;
        if (!token) return;

        const hub = new HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(LogLevel.Warning)
            .build();

        connRef.current = hub;

        // ── Lắng nghe sự kiện cập nhật đơn hàng ──────────────────────────
        hub.on('OrderStatusChanged', (data: any) => {
            console.log('[OrderHub] Received OrderStatusChanged:', data);
            try {
                // Hỗ trợ cả camelCase và PascalCase
                const orderId = data.donHangId || data.DonHangId;
                const status = data.trangThai || data.TrangThai;
                const msg = data.message || data.Message;

                const cfg = STATUS_MESSAGES[status];
                const title = cfg?.title ?? `Đơn hàng cập nhật: ${status}`;
                const notificationMsg = msg || (cfg?.message ?? `Đơn hàng #${String(orderId).slice(0, 8).toUpperCase()} đã được cập nhật.`);
                
                addNotification({
                    type: 'order',
                    title,
                    message: notificationMsg,
                    link: '/orders',
                });
                
                // Hiển thị toast popup
                toast.info(title, { description: notificationMsg });
            } catch (err) {
                console.error('[OrderHub] Error processing OrderStatusChanged:', err);
            }
        });

        // ── Lắng nghe đơn hàng mới (Dành cho Seller) ──────────────────────
        hub.on('NewOrder', (data: any) => {
            console.log('[OrderHub] Received NewOrder:', data);
            try {
                const orderId = data.donHangId || data.DonHangId;
                const total = data.tongThanhToan || data.TongThanhToan;
                const title = '🛒 Đơn hàng mới';
                const message = `Bạn có đơn hàng mới #${String(orderId).slice(0, 8).toUpperCase()} trị giá ${Number(total).toLocaleString()}đ.`;
                
                addNotification({
                    type: 'order',
                    title,
                    message,
                    link: '/farmer/orders',
                });
                toast.success(title, { description: message });
            } catch (err) {
                console.error('[OrderHub] Error processing NewOrder:', err);
            }
        });

        // ── Lắng nghe thanh toán MoMo thành công ─────────────────────────
        hub.on('MomoPaymentSuccess', (data: any) => {
            console.log('[OrderHub] Received MomoPaymentSuccess:', data);
            try {
                const orderId = data.donHangId || data.DonHangId;
                const soTien = data.soTien || data.SoTien || 0;
                const msg = data.message || data.Message;

                const title = '💳 Thanh toán thành công';
                const message = msg || `Thanh toán ${Number(soTien).toLocaleString()}đ cho đơn hàng #${String(orderId).slice(0, 8).toUpperCase()} thành công.`;
                
                addNotification({
                    type: 'order',
                    title,
                    message,
                    link: '/orders',
                });
                
                toast.success(title, { description: message });
            } catch (err) {
                console.error('[OrderHub] Error processing MomoPaymentSuccess:', err);
            }
        });

        // ── Lắng nghe thanh toán MoMo thất bại ───────────────────────────
        hub.on('MomoPaymentFailed', (data: any) => {
            console.log('[OrderHub] Received MomoPaymentFailed:', data);
            try {
                const orderId = data.donHangId || data.DonHangId;
                const msg = data.message || data.Message;

                const title = '❌ Thanh toán thất bại';
                const message = msg || `Thanh toán cho đơn hàng #${String(orderId).slice(0, 8).toUpperCase()} đã thất bại.`;
                
                addNotification({
                    type: 'order',
                    title,
                    message,
                    link: '/orders',
                });
                toast.error(title, { description: message });
            } catch (err) {
                console.error('[OrderHub] Error processing MomoPaymentFailed:', err);
            }
        });

        // ── Lắng nghe thông báo hệ thống ─────────────────────────────────
        hub.on('SystemNotification', (title: string, message: string) => {
            addNotification({ type: 'system', title, message });
            toast.info(title, { description: message });
        });

        // ── Khởi động kết nối ─────────────────────────────────────────────
        hub.start().catch((err) => {
            console.warn('[OrderHub] Kết nối thất bại:', err);
        });

        return () => {
            hub.off('OrderStatusChanged');
            hub.off('NewOrder');
            hub.off('MomoPaymentSuccess');
            hub.off('MomoPaymentFailed');
            hub.off('SystemNotification');
            if (connRef.current?.state === HubConnectionState.Connected) {
                connRef.current.stop();
            }
        };
    }, [isAuthenticated, addNotification]);
}
