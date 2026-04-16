import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChat } from '../hooks/useChat';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import type { Conversation } from '../types/chat.types';

/**
 * FloatingChat – Bong bóng chat nổi ở góc phải màn hình (cho Buyer)
 * Hoạt động 3 pha:
 *   CLOSED   → chỉ hiện nút bubble
 *   LIST     → panel danh sách conversations
 *   CHAT     → panel chat với một người cụ thể
 */
type Phase = 'closed' | 'list' | 'chat';

interface FloatingChatProps {
    /** ID người bán cần chat ngay (từ ProductDetailPage) */
    targetSellerId?: string;
    targetSellerName?: string;
    targetSellerAvatar?: string;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({
    targetSellerId,
    targetSellerName,
    targetSellerAvatar,
}) => {
    const { user, isAuthenticated } = useAuthStore();
    const [phase, setPhase] = useState<Phase>('closed');

    const {
        conversations,
        activeUserId,
        messages,
        unreadCount,
        loadingConv,
        loadingMsg,
        loadConversations,
        openConversation,
        sendMessage,
    } = useChat({ autoConnect: isAuthenticated });

    // Active conversation object
    const activeConversation: Conversation | null =
        conversations.find((c) => c.otherUserId === activeUserId) ??
        (activeUserId && targetSellerId === activeUserId
            ? {
                  otherUserId: targetSellerId,
                  otherUserName: targetSellerName ?? 'Người bán',
                  otherUserAvatar: targetSellerAvatar,
                  lastMessage: '',
                  lastMessageTime: new Date().toISOString(),
                  unreadCount: 0,
                  isLastMessageMine: false,
              }
            : null);

    // Load conversations khi mở panel danh sách
    const handleOpenList = async () => {
        setPhase('list');
        await loadConversations();
    };

    const handleToggle = () => {
        if (phase === 'closed') {
            // Trên trang sản phẩm: mở thẳng chat với người bán
            if (targetSellerId && isAuthenticated) {
                setPhase('chat');
                openConversation(targetSellerId);
            } else {
                handleOpenList();
            }
        } else {
            setPhase('closed');
        }
    };

    const handleSelectConversation = async (otherUserId: string) => {
        setPhase('chat');
        await openConversation(otherUserId);
    };

    const handleBack = () => {
        setPhase('list');
    };

    const handleClose = () => {
        setPhase('closed');
    };

    // Không hiện nếu chưa đăng nhập
    if (!isAuthenticated || !user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* ── PANEL (list hoặc chat) ─────────────────────────────────── */}
            {phase !== 'closed' && (
                <div
                    className="
                        w-[340px] h-[520px] bg-white dark:bg-[#1a261c]
                        rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
                        flex flex-col overflow-hidden
                        animate-in slide-in-from-bottom-4 fade-in duration-200
                    "
                >
                    {phase === 'list' && (
                        <>
                            {/* Header list */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-primary shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white text-[20px]">
                                        forum
                                    </span>
                                    <h3 className="text-white font-semibold text-sm">Tin nhắn</h3>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>

                            {/* Conversation List */}
                            <ConversationList
                                conversations={conversations}
                                activeUserId={activeUserId}
                                loading={loadingConv}
                                onSelect={handleSelectConversation}
                            />
                        </>
                    )}

                    {phase === 'chat' && (
                        <ChatWindow
                            currentUserId={user.id}
                            conversation={activeConversation}
                            messages={messages}
                            loading={loadingMsg}
                            onSend={sendMessage}
                            onBack={handleBack}
                            onClose={handleClose}
                        />
                    )}
                </div>
            )}

            {/* ── BUBBLE BUTTON ─────────────────────────────────────────── */}
            <button
                onClick={handleToggle}
                className="
                    relative w-14 h-14 rounded-full bg-primary text-white
                    shadow-lg shadow-primary/40 hover:bg-[#246328]
                    flex items-center justify-center
                    transition-all duration-200 active:scale-95
                    hover:scale-105
                "
                aria-label="Mở chat"
            >
                <span className="material-symbols-outlined text-[26px]">
                    {phase !== 'closed' ? 'close' : 'chat'}
                </span>

                {/* Badge tin chưa đọc */}
                {unreadCount > 0 && phase === 'closed' && (
                    <span className="
                        absolute -top-1 -right-1 min-w-[20px] h-5 px-1
                        bg-red-500 text-white text-[11px] font-bold rounded-full
                        flex items-center justify-center animate-bounce
                    ">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};
