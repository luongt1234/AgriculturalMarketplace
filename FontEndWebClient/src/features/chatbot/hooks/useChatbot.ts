import { useState, useCallback } from 'react';
import { sendChatbotMessage } from '../api/chatbot.api';
import type { ChatbotMessage, ChatbotHistoryItem } from '../types/chatbot.types';

const WELCOME_MESSAGE: ChatbotMessage = {
    id: 'welcome',
    role: 'model',
    content: 'Xin chào! Tôi là trợ lý AI của PeachyMarket 🌾\n\nTôi có thể giúp bạn:\n• Tư vấn chọn mua nông sản theo mùa\n• Tra cứu thông tin về giá cả, chất lượng\n• Hướng dẫn cách bảo quản nông sản\n• Hỗ trợ sử dụng nền tảng AgroMarket\n\nBạn muốn hỏi gì nào?',
    timestamp: new Date(),
};

export const useChatbot = () => {
    const [messages, setMessages] = useState<ChatbotMessage[]>([WELCOME_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Gửi tin nhắn & nhận phản hồi từ AI
     */
    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: ChatbotMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        // Tin nhắn loading placeholder
        const loadingMessage: ChatbotMessage = {
            id: `loading-${Date.now()}`,
            role: 'model',
            content: '',
            timestamp: new Date(),
            isLoading: true,
        };

        setMessages((prev) => [...prev, userMessage, loadingMessage]);
        setIsLoading(true);

        try {
            // Xây dựng history (bỏ welcome message và loading)
            const history: ChatbotHistoryItem[] = messages
                .filter((m) => m.id !== 'welcome' && !m.isLoading)
                .map((m) => ({ role: m.role, content: m.content }));

            const response = await sendChatbotMessage(text.trim(), history);

            const aiMessage: ChatbotMessage = {
                id: `ai-${Date.now()}`,
                role: 'model',
                content: response.success
                    ? response.reply
                    : (response.error ?? 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.'),
                timestamp: new Date(),
            };

            // Thay thế loading placeholder bằng phản hồi thực
            setMessages((prev) => prev.filter((m) => !m.isLoading).concat(aiMessage));
        } catch {
            const errorMessage: ChatbotMessage = {
                id: `error-${Date.now()}`,
                role: 'model',
                content: 'Xin lỗi, không thể kết nối đến AI. Vui lòng kiểm tra kết nối và thử lại.',
                timestamp: new Date(),
            };
            setMessages((prev) => prev.filter((m) => !m.isLoading).concat(errorMessage));
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    const clearMessages = useCallback(() => {
        setMessages([WELCOME_MESSAGE]);
    }, []);

    return { messages, isLoading, sendMessage, clearMessages };
};
