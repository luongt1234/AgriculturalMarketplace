import { useCallback, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import {
    buildHubConnection,
    fetchConversations,
    fetchMessages,
    fetchUnreadCount,
    markRead,
} from '../api/chat.api';
import type { Conversation, Message } from '../types/chat.types';

interface UseChatOptions {
    /** Nếu true, kết nối hub ngay khi mount */
    autoConnect?: boolean;
}

export const useChat = (options: UseChatOptions = {}) => {
    const { autoConnect = true } = options;

    const hubRef = useRef<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeUserId, setActiveUserId] = useState<string | null>(null);
    const activeUserIdRef = useRef<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        activeUserIdRef.current = activeUserId;
    }, [activeUserId]);

    const [loadingConv, setLoadingConv] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(false);

    // ─── Kết nối SignalR ────────────────────────────────────────────────────
    const connect = useCallback(async () => {
        if (
            hubRef.current &&
            hubRef.current.state !== signalR.HubConnectionState.Disconnected
        ) {
            return;
        }

        const hub = buildHubConnection();
        hubRef.current = hub;

        hub.on('ReceiveMessage', (msg: Message) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        hub.on('NewMessageNotification', (msg: Message) => {
            setUnreadCount((c) => c + 1);

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.otherUserId === msg.nguoiGuiId
                        ? {
                            ...conv,
                            lastMessage: msg.noiDung,
                            lastMessageTime: msg.thoiGian,
                            unreadCount: conv.unreadCount + 1,
                        }
                        : conv
                )
            );

            // NẾU đang mở chat với người này, push luôn tin nhắn vào list và gọi markRead
            if (activeUserIdRef.current === msg.nguoiGuiId) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                // Đánh dấu đã đọc ngầm để backend biết
                markRead(msg.nguoiGuiId).catch(() => {});
            }
        });

        hub.on('MessagesRead', () => { });

        hub.onclose(() => setIsConnected(false));
        hub.onreconnected(() => setIsConnected(true));

        try {
            await hub.start();

            if (hubRef.current === hub) {
                if (hub.state === signalR.HubConnectionState.Connected) {
                    setIsConnected(true);
                }
            } else {
                hub.stop(); // Ngắt nếu có kết nối mới ghi đè
            }
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('stopped during negotiation')) {
                // Bỏ qua lỗi ngắt kết nối do React Strict Mode unmount
                return;
            }
            console.error('ChatHub connection failed:', err);
            if (hubRef.current === hub) {
                hubRef.current = null;
            }
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (!hubRef.current) return;
        const hub = hubRef.current;
        hubRef.current = null;
        setIsConnected(false);
        await hub.stop().catch(() => {});
    }, []);

    useEffect(() => {
        if (autoConnect) connect();
        return () => { disconnect(); };
    }, [autoConnect, connect, disconnect]);

    // ─── Tự động Join Group khi có mạng và có activeUser ─────────────────────
    useEffect(() => {
        if (isConnected && activeUserId && hubRef.current?.state === signalR.HubConnectionState.Connected) {
            hubRef.current.invoke('JoinConversation', activeUserId).catch(() => {});
        }
    }, [isConnected, activeUserId]);

    // ─── Load conversations ─────────────────────────────────────────────────
    const loadConversations = useCallback(async () => {
        try {
            setLoadingConv(true);
            const data = await fetchConversations();
            setConversations(data);
        } catch (err) {
            console.error('Lỗi load conversations:', err);
        } finally {
            setLoadingConv(false);
        }
    }, []);

    // ─── Mở một hội thoại ──────────────────────────────────────────────────
    const openConversation = useCallback(
        async (otherUserId: string) => {
            // Rời conversation cũ
            if (activeUserId && hubRef.current) {
                await hubRef.current.invoke('LeaveConversation', activeUserId).catch(() => { });
            }
            setActiveUserId(otherUserId);
            setMessages([]);
            setLoadingMsg(true);

            // Join conversation group (hub cũng mark-as-read)
            if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
                await hubRef.current.invoke('JoinConversation', otherUserId).catch(() => { });
            }

            // Load lịch sử
            try {
                const msgs = await fetchMessages(otherUserId);
                setMessages(msgs);
            } catch (err) {
                console.error('Lỗi load messages:', err);
            } finally {
                setLoadingMsg(false);
            }

            // Reset unread cho conversation này
            setConversations((prev) =>
                prev.map((c) =>
                    c.otherUserId === otherUserId ? { ...c, unreadCount: 0 } : c
                )
            );
            setUnreadCount((n) => Math.max(0, n - (conversations.find((c) => c.otherUserId === otherUserId)?.unreadCount ?? 0)));
            await markRead(otherUserId).catch(() => { });
        },
        [activeUserId, conversations]
    );

    // ─── Gửi tin nhắn ──────────────────────────────────────────────────────
    const sendMessage = useCallback(
        async (noiDung: string) => {
            if (!activeUserId || !noiDung.trim()) return;
            const hub = hubRef.current;
            if (hub?.state === signalR.HubConnectionState.Connected) {
                await hub.invoke('SendMessage', {
                    nguoiNhanId: activeUserId,
                    noiDung: noiDung.trim(),
                });
            } else {
                // Fallback qua REST
                const { sendMessageRest } = await import('../api/chat.api');
                const msg = await sendMessageRest({ nguoiNhanId: activeUserId, noiDung: noiDung.trim() });
                setMessages((prev) => [...prev, msg]);
            }
        },
        [activeUserId]
    );

    // ─── Load unread count ──────────────────────────────────────────────────
    const loadUnreadCount = useCallback(async () => {
        try {
            const count = await fetchUnreadCount();
            setUnreadCount(count);
        } catch { /* ignored */ }
    }, []);

    return {
        // state
        isConnected,
        conversations,
        activeUserId,
        messages,
        unreadCount,
        loadingConv,
        loadingMsg,
        // actions
        loadConversations,
        openConversation,
        sendMessage,
        loadUnreadCount,
        setActiveUserId,
    };
};
