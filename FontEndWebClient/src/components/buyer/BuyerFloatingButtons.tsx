import React from 'react';
import { AIChatbot } from '../../features/chatbot/components/AIChatbot';
import { FloatingChat } from '../../features/chat/components/FloatingChat';

interface BuyerFloatingButtonsProps {
    targetSellerId?: string;
    targetSellerName?: string;
    targetSellerAvatar?: string;
}

/**
 * Component gói cả 2 nút nổi (Chatbot AI và Chat giữa người-người) 
 * Giúp định vị góc phải dưới màn hình và tránh đè lên nhau
 */
export const BuyerFloatingButtons: React.FC<BuyerFloatingButtonsProps> = (props) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Chatbot AI (Màu tím) ở trên */}
            <AIChatbot />

            {/* Chat người bán (Màu xanh) ở dưới, dùng embedded để không tự set fixed position */}
            <FloatingChat embedded {...props} />
        </div>
    );
};
