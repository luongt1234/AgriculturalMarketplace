// ─── Types cho AI Chatbot ─────────────────────────────────────────────────────

export type ChatbotRole = 'user' | 'model';

export interface ChatbotMessage {
    id: string;
    role: ChatbotRole;
    content: string;
    timestamp: Date;
    isLoading?: boolean;
}

export interface ChatbotHistoryItem {
    role: ChatbotRole;
    content: string;
}

export interface ChatbotRequest {
    message: string;
    history?: ChatbotHistoryItem[];
}

export interface ChatbotResponse {
    reply: string;
    success: boolean;
    error?: string;
}
