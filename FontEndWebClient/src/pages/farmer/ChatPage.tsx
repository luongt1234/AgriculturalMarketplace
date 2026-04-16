import React, { useEffect, useState } from 'react';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import { useAuthStore } from '../../store/useAuthStore';
import { useChat } from '../../features/chat/hooks/useChat';
import { ConversationList } from '../../features/chat/components/ConversationList';
import { ChatWindow } from '../../features/chat/components/ChatWindow';
import type { Conversation } from '../../features/chat/types/chat.types';

export const FarmerChatPage: React.FC = () => {
    useSetPageTitle('Tin nhắn');
    const { user } = useAuthStore();
    const [isMobileView, setIsMobileView] = useState(false);

    const {
        conversations,
        activeUserId,
        messages,
        loadingConv,
        loadingMsg,
        loadConversations,
        openConversation,
        sendMessage,
        setActiveUserId,
    } = useChat({ autoConnect: true });

    // Active conversation object
    const activeConversation: Conversation | null =
        conversations.find((c) => c.otherUserId === activeUserId) ?? null;

    // Load conversations khi mount
    useEffect(() => {
        loadConversations();
    }, []);

    const handleSelectConversation = async (otherUserId: string) => {
        setIsMobileView(true);
        await openConversation(otherUserId);
    };

    const handleBack = () => {
        setIsMobileView(false);
        setActiveUserId(null);
    };

    if (!user) return null;

    return (
        <div className="flex h-full bg-white dark:bg-[#1a261c] rounded-xl border border-[#e0e2e0] dark:border-[#2f3a30] shadow-sm overflow-hidden">

            {/* ── Sidebar: Danh sách hội thoại ─────────────────────────────── */}
            <div
                className={`
                    ${isMobileView ? 'hidden md:flex' : 'flex'}
                    flex-col w-full md:w-[300px] lg:w-[340px] border-r border-gray-100 dark:border-gray-700 shrink-0
                `}
            >
                {/* Header sidebar */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1a261c]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Tin nhắn</h2>
                        <span className="text-xs text-gray-400">
                            {conversations.length} cuộc trò chuyện
                        </span>
                    </div>
                    {/* Search (UI only) */}
                    <div className="mt-3 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <ConversationList
                    conversations={conversations}
                    activeUserId={activeUserId}
                    loading={loadingConv}
                    onSelect={handleSelectConversation}
                />
            </div>

            {/* ── Main: Cửa sổ chat ────────────────────────────────────────── */}
            <div className={`${!isMobileView ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
                <ChatWindow
                    currentUserId={user.id}
                    conversation={activeConversation}
                    messages={messages}
                    loading={loadingMsg}
                    onSend={sendMessage}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
};

export default FarmerChatPage;
