import * as signalR from '@microsoft/signalr';
import axiosInstance from '../../../lip/axiosInstance';
import type { Conversation, Message, SendMessagePayload } from '../types/chat.types';

const HUB_URL = `${import.meta.env.VITE_HUB_URL ?? '/hubs/chat'}`;

// Lấy token từ zustand persist storage
const getToken = (): string | null => {
    try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw) return null;
        return JSON.parse(raw)?.state?.token ?? null;
    } catch {
        return null;
    }
};

// ─── REST API calls ──────────────────────────────────────────────────────────

export const fetchConversations = async (): Promise<Conversation[]> => {
    const res = await axiosInstance.get<Conversation[]>('/api/TinNhan/conversations');
    return (res as any).data ?? [];
};

export const fetchMessages = async (
    otherUserId: string,
    page = 1,
    pageSize = 30
): Promise<Message[]> => {
    const res = await axiosInstance.get<Message[]>(
        `/api/TinNhan/history/${otherUserId}?page=${page}&pageSize=${pageSize}`
    );
    return (res as any).data ?? [];
};

export const sendMessageRest = async (payload: SendMessagePayload): Promise<Message> => {
    const res = await axiosInstance.post<Message>('/api/TinNhan/send', payload);
    return (res as any).data;
};

export const markRead = async (otherUserId: string): Promise<void> => {
    await axiosInstance.patch(`/api/TinNhan/mark-read/${otherUserId}`);
};

export const fetchUnreadCount = async (): Promise<number> => {
    const res = await axiosInstance.get<number>('/api/TinNhan/unread-count');
    return (res as any).data ?? 0;
};

// ─── SignalR Hub Connection ──────────────────────────────────────────────────

export const buildHubConnection = (): signalR.HubConnection => {
    return new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
            accessTokenFactory: () => getToken() ?? '',
            transport: signalR.HttpTransportType.WebSockets |
                       signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();
};
