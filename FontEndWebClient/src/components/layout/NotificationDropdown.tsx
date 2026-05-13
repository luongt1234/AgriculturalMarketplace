import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore, type AppNotification, type NotificationType } from '../../store/useNotificationStore';

// ── Helpers ────────────────────────────────────────────────────────────────────
function typeConfig(type: NotificationType): { icon: string; color: string } {
    switch (type) {
        case 'order':   return { icon: 'receipt_long',      color: 'text-primary bg-primary/10' };
        case 'system':  return { icon: 'info',              color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
        case 'promo':   return { icon: 'local_offer',       color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' };
        default:        return { icon: 'notifications',     color: 'text-gray-500 bg-gray-100 dark:bg-gray-700' };
    }
}

function timeAgo(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return new Date(iso).toLocaleDateString('vi-VN');
}

// ── Single notification row ────────────────────────────────────────────────────
function NotifItem({ notif, onRead, onRemove }: {
    notif: AppNotification;
    onRead: (id: string) => void;
    onRemove: (id: string) => void;
}) {
    const navigate = useNavigate();
    const cfg = typeConfig(notif.type);

    const handleClick = () => {
        onRead(notif.id);
        if (notif.link) navigate(notif.link);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-3 px-4 py-3 group transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 ${
                notif.isRead
                    ? 'hover:bg-gray-50 dark:hover:bg-white/5'
                    : 'bg-primary/[0.03] hover:bg-primary/[0.06] dark:bg-primary/10 dark:hover:bg-primary/15'
            }`}
        >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${cfg.color}`}>
                <span className="material-symbols-outlined text-[18px]">{cfg.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${notif.isRead ? 'font-medium text-gray-700 dark:text-gray-300' : 'font-bold text-gray-900 dark:text-white'}`}>
                        {notif.title}
                    </p>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(notif.id); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all shrink-0 p-0.5 rounded"
                    >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[11px]">schedule</span>
                    {timeAgo(notif.timestamp)}
                </p>
            </div>

            {/* Unread dot */}
            {!notif.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
            )}
        </div>
    );
}

// ── Main NotificationDropdown ─────────────────────────────────────────────────
export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
    } = useNotificationStore();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative hidden sm:block" ref={ref}>
            {/* Bell button */}
            <button
                id="notification-bell-btn"
                onClick={() => setIsOpen((o) => !o)}
                className={`relative p-2 rounded-full transition-colors ${
                    isOpen
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <span className="material-symbols-outlined text-[24px]">
                    {unreadCount > 0 ? 'notifications_active' : 'notifications'}
                </span>
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-[#1a261c] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Thông báo</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:underline font-semibold"
                                >
                                    Đọc tất cả
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                    title="Xóa tất cả"
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-700 block mb-2">
                                    notifications_off
                                </span>
                                <p className="text-sm text-gray-400">Chưa có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <NotifItem
                                    key={notif.id}
                                    notif={notif}
                                    onRead={markAsRead}
                                    onRemove={removeNotification}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 text-center">
                            <span className="text-xs text-gray-400">
                                {notifications.length} thông báo • Lưu tối đa 50
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
