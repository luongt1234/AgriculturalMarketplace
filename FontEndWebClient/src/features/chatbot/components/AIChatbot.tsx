import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../hooks/useChatbot';
import type { ChatbotMessage } from '../types/chatbot.types';

// ─── Typing Dots Animation ────────────────────────────────────────────────────
const TypingDots: React.FC = () => (
    <div className="flex items-center gap-1 py-1">
        <span
            className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
            style={{ animationDelay: '0ms' }}
        />
        <span
            className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
            style={{ animationDelay: '150ms' }}
        />
        <span
            className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
            style={{ animationDelay: '300ms' }}
        />
    </div>
);

// ─── Message Bubble ───────────────────────────────────────────────────────────
const AIChatMessage: React.FC<{ message: ChatbotMessage }> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
            {/* Avatar AI */}
            {!isUser && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-white text-[14px]">
                        smart_toy
                    </span>
                </div>
            )}

            {/* Bubble */}
            <div
                className={`
                    max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${isUser
                        ? 'bg-violet-600 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-[#2a2040] text-gray-800 dark:text-gray-100 rounded-bl-sm'
                    }
                `}
            >
                {message.isLoading ? (
                    <TypingDots />
                ) : (
                    <div className="whitespace-pre-line">{message.content}</div>
                )}
                {!message.isLoading && (
                    <div className={`text-[10px] mt-1 ${isUser ? 'text-violet-200' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Quick Questions ──────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
    '🌾 Lúa mùa nào ngon nhất?',
    '🍅 Cách bảo quản cà chua',
    '💰 Giá rau củ hôm nay',
    '🛒 Cách đặt hàng trên AgroMarket',
];

// ─── Main Component ───────────────────────────────────────────────────────────
export const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [showQuickQ, setShowQuickQ] = useState(true);
    const { messages, isLoading, sendMessage, clearMessages } = useChatbot();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input khi mở panel
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen]);

    // Lắng nghe sự kiện mở từ bên ngoài (ví dụ: nút "Tư vấn kĩ thuật" ở HeroBanner)
    useEffect(() => {
        const handleOpenEvent = () => setIsOpen(true);
        window.addEventListener('open-ai-chatbot', handleOpenEvent);
        return () => window.removeEventListener('open-ai-chatbot', handleOpenEvent);
    }, []);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;
        setShowQuickQ(false);
        const text = inputText;
        setInputText('');
        await sendMessage(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickQuestion = async (q: string) => {
        setShowQuickQ(false);
        await sendMessage(q.replace(/^[\p{Emoji}\s]+/u, '').trim());
    };

    const handleClear = () => {
        clearMessages();
        setShowQuickQ(true);
        setInputText('');
    };

    return (
        <div className="flex flex-col items-end gap-3">
            {/* ── PANEL ─────────────────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="
                        w-[340px] h-[520px] flex flex-col overflow-hidden
                        rounded-2xl shadow-2xl
                        border border-violet-200 dark:border-violet-800/50
                        bg-white dark:bg-[#1a1526]
                        animate-in slide-in-from-bottom-4 fade-in duration-200
                    "
                    style={{ boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-gradient-to-r from-violet-600 to-purple-700">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[18px]">
                                    smart_toy
                                </span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm leading-tight">
                                    Trợ lý AI AgroMarket
                                </h3>
                                <p className="text-violet-200 text-[10px] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                                    Powered by Gemini
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleClear}
                                className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Cuộc trò chuyện mới"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    refresh
                                </span>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    close
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scrollbar-thin scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-800">
                        {messages.map((msg) => (
                            <AIChatMessage key={msg.id} message={msg} />
                        ))}

                        {/* Quick Questions (chỉ hiện khi chưa chat) */}
                        {showQuickQ && messages.length === 1 && (
                            <div className="mt-3 space-y-2">
                                <p className="text-xs text-gray-400 text-center">
                                    Câu hỏi nhanh
                                </p>
                                {QUICK_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleQuickQuestion(q)}
                                        className="
                                            w-full text-left text-xs px-3 py-2 rounded-xl
                                            border border-violet-200 dark:border-violet-700/50
                                            text-violet-700 dark:text-violet-300
                                            hover:bg-violet-50 dark:hover:bg-violet-900/30
                                            transition-colors
                                        "
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3 pb-3 pt-2 shrink-0 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#231c35] rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-violet-400 dark:focus-within:border-violet-500 transition-colors">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Hỏi về nông sản..."
                                disabled={isLoading}
                                className="
                                    flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100
                                    placeholder:text-gray-400 outline-none min-w-0
                                    disabled:opacity-50
                                "
                            />
                            <button
                                id="ai-chatbot-send-btn"
                                onClick={handleSend}
                                disabled={!inputText.trim() || isLoading}
                                className="
                                    w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700
                                    flex items-center justify-center shrink-0
                                    text-white shadow-sm
                                    hover:from-violet-600 hover:to-purple-800
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    transition-all active:scale-95
                                "
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {isLoading ? 'hourglass_empty' : 'send'}
                                </span>
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-1.5">
                            AI có thể mắc lỗi. Hãy kiểm chứng thông tin quan trọng.
                        </p>
                    </div>
                </div>
            )}

            {/* ── BUBBLE BUTTON ─────────────────────────────────────────── */}
            <button
                id="ai-chatbot-trigger"
                onClick={() => setIsOpen((prev) => !prev)}
                className="
                    relative w-14 h-14 rounded-full
                    bg-gradient-to-br from-violet-500 to-purple-700
                    text-white shadow-lg
                    flex items-center justify-center
                    hover:scale-105 active:scale-95
                    transition-all duration-200
                "
                style={{ boxShadow: '0 4px 20px rgba(124, 58, 237, 0.45)' }}
                aria-label="Mở trợ lý AI"
                title="Trợ lý AI AgroMarket"
            >
                <span className="material-symbols-outlined text-[26px]">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
                {/* Hiệu ứng pulse */}
                {!isOpen && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-violet-300" />
                    </span>
                )}
            </button>
        </div>
    );
};
