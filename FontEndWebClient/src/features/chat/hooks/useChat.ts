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
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [loadingConv, setLoadingConv] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(false);

    // ─── Kết nối SignalR ────────────────────────────────────────────────────
    const connect = useCallback(async () => {
        if (hubRef.current) return; // đã kết nối
        const hub = buildHubConnection();
        hubRef.current = hub;

        // Nhận tin nhắn mới trong conversation đang mở
        hub.on('ReceiveMessage', (msg: Message) => {
            setMessages((prev) => {
                // Tránh duplicate
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        // Có tin nhắn mới từ bất kỳ conversation nào
        hub.on('NewMessageNotification', (msg: Message) => {
            setUnreadCount((c) => c + 1);
            // Cập nhật preview tin nhắn cuối trong danh sách
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
        });

        // Người nhận đã đọc tin
        hub.on('MessagesRead', () => {
            // Có thể dùng để update tick "đã đọc" nếu muốn
        });

        hub.onclose(() => setIsConnected(false));
        hub.onreconnected(() => setIsConnected(true));

        try {
            await hub.start();
            setIsConnected(true);
        } catch (err) {
            console.error('ChatHub connection failed:', err);
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (!hubRef.current) return;
        await hubRef.current.stop();
        hubRef.current = null;
        setIsConnected(false);
    }, []);

    useEffect(() => {
        if (autoConnect) connect();
        return () => { disconnect(); };
    }, [autoConnect, connect, disconnect]);

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
                await hubRef.current.invoke('LeaveConversation', activeUserId).catch(() => {});
            }
            setActiveUserId(otherUserId);
            setMessages([]);
            setLoadingMsg(true);

            // Join conversation group (hub cũng mark-as-read)
            if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
                await hubRef.current.invoke('JoinConversation', otherUserId).catch(() => {});
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
            await markRead(otherUserId).catch(() => {});
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
