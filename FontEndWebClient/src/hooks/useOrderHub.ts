import { useEffect, useRef, useState } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

const HUB_URL = `${import.meta.env.VITE_ORDER_HUB_URL ?? '/hubs/order'}`;

/**
 * Hook để kết nối và lắng nghe sự kiện từ OrderHub (SignalR).
 * Token JWT được truyền qua query string.
 */
export function useOrderHub() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const connRef = useRef<HubConnection | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token') ?? sessionStorage.getItem('token') ?? '';
        if (!token) return;

        const hub = new HubConnectionBuilder()
            .withUrl(`${HUB_URL}?access_token=${token}`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        connRef.current = hub;

        hub.start()
            .then(() => {
                setConnection(hub);
            })
            .catch((err) => {
                console.warn('[OrderHub] Không thể kết nối:', err);
            });

        return () => {
            if (connRef.current?.state === HubConnectionState.Connected) {
                connRef.current.stop();
            }
        };
    }, []);

    return { connection };
}
