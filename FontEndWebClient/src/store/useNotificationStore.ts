import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'order' | 'system' | 'promo' | 'info';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string; // ISO string
    isRead: boolean;
    link?: string;      // optional navigation link
}

interface NotificationState {
    notifications: AppNotification[];
    unreadCount: number;

    addNotification: (notif: Omit<AppNotification, 'id' | 'isRead' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notif) => {
                const newItem: AppNotification = {
                    ...notif,
                    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    isRead: false,
                    timestamp: new Date().toISOString(),
                };
                set((state) => ({
                    notifications: [newItem, ...state.notifications].slice(0, 50), // Keep max 50
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markAsRead: (id) => {
                set((state) => {
                    const notifications = state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    );
                    const unreadCount = notifications.filter((n) => !n.isRead).length;
                    return { notifications, unreadCount };
                });
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }));
            },

            removeNotification: (id) => {
                set((state) => {
                    const notifications = state.notifications.filter((n) => n.id !== id);
                    const unreadCount = notifications.filter((n) => !n.isRead).length;
                    return { notifications, unreadCount };
                });
            },

            clearAll: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'notification-storage',
            // Chỉ persist notifications, recompute unreadCount on rehydrate
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
                }
            },
        }
    )
);
