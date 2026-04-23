import axiosInstance from '../../../lip/axiosInstance';
import type { ChatbotHistoryItem, ChatbotResponse } from '../types/chatbot.types';

/**
 * Gửi tin nhắn đến Gemini AI qua backend
 */
export const sendChatbotMessage = async (
    message: string,
    history?: ChatbotHistoryItem[]
): Promise<ChatbotResponse> => {
    const res = await axiosInstance.post<ChatbotResponse>('/api/chatbot/chat', {
        message,
        history: history ?? [],
    });
    return (res as any);
};
