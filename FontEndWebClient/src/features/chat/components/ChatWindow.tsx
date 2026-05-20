import React, { useEffect, useRef } from 'react';
import type { Conversation, Message } from '../types/chat.types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { getImageUrl } from '../../../utils/imageUrl';

interface ChatWindowProps {
    currentUserId: string;
    conversation: Conversation | null;
    messages: Message[];
    loading?: boolean;
    onSend: (text: string) => void;
    onBack?: () => void;      // cho mobile / floating
    onClose?: () => void;     // nút X (floating bubble)
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    currentUserId,
    conversation,
    messages,
    loading = false,
    onSend,
    onBack,
    onClose,
}) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto scroll xuống cuối khi có tin mới
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!conversation) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 dark:bg-background-dark text-gray-400 gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">chat</span>
                </div>
                <p className="text-sm font-medium">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1a261c] shrink-0">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors mr-1"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                )}

                {/* Avatar + tên */}
                <div
                    className="w-9 h-9 rounded-full bg-gray-200 bg-cover bg-center border border-gray-200 dark:border-gray-700 shrink-0"
                    style={{
                        backgroundImage: conversation.otherUserAvatar
                            ? `url('${getImageUrl(conversation.otherUserAvatar)}')`
                            : undefined,
                    }}
                >
                    {!conversation.otherUserAvatar && (
                        <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {conversation.otherUserName}
                    </span>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-background-dark">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                            progress_activity
                        </span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                        <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                        <p className="text-sm">Chưa có tin nhắn nào. Hãy chào hỏi!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isMine={msg.nguoiGuiId === currentUserId}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={onSend} disabled={loading} />
        </div>
    );
};
