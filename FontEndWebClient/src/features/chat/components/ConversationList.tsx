import React from 'react';
import type { Conversation } from '../types/chat.types';

interface ConversationListProps {
    conversations: Conversation[];
    activeUserId?: string | null;
    loading?: boolean;
    onSelect: (userId: string) => void;
}

const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    activeUserId,
    loading = false,
    onSelect,
}) => {
    if (loading) {
        return (
            <div className="flex flex-col gap-2 px-3 py-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                        <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400 gap-3">
                <span className="material-symbols-outlined text-4xl">forum</span>
                <p className="text-sm text-center">Chưa có cuộc trò chuyện nào</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto h-full">
            {conversations.map((conv) => {
                const isActive = conv.otherUserId === activeUserId;
                return (
                    <button
                        key={conv.otherUserId}
                        onClick={() => onSelect(conv.otherUserId)}
                        className={`
                            flex items-center gap-3 px-4 py-3 text-left transition-colors
                            hover:bg-gray-50 dark:hover:bg-white/5
                            ${isActive ? 'bg-primary/8 dark:bg-primary/15 border-r-[3px] border-primary' : ''}
                        `}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className="w-11 h-11 rounded-full bg-gray-200 bg-cover bg-center border border-gray-100 dark:border-gray-700"
                                style={{
                                    backgroundImage: conv.otherUserAvatar
                                        ? `url('${conv.otherUserAvatar}')`
                                        : undefined,
                                }}
                            >
                                {!conv.otherUserAvatar && (
                                    <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-[22px]">
                                            person
                                        </span>
                                    </div>
                                )}
                            </div>
                            {conv.unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                                <span
                                    className={`text-sm truncate ${
                                        conv.unreadCount > 0
                                            ? 'font-bold text-gray-900 dark:text-white'
                                            : 'font-medium text-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {conv.otherUserName}
                                </span>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                    {formatTime(conv.lastMessageTime)}
                                </span>
                            </div>
                            <p
                                className={`text-xs truncate mt-0.5 ${
                                    conv.unreadCount > 0
                                        ? 'text-gray-700 dark:text-gray-300 font-medium'
                                        : 'text-gray-400 dark:text-gray-500'
                                }`}
                            >
                                {conv.isLastMessageMine ? 'Bạn: ' : ''}
                                {conv.lastMessage}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
