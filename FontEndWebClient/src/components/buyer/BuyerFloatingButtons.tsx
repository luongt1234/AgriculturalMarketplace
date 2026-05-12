import React from 'react';
import { AIChatbot } from '../../features/chatbot/components/AIChatbot';
import { FloatingChat } from '../../features/chat/components/FloatingChat';
import { CategoryFloatingButton } from './CategorySidebar';

interface BuyerFloatingButtonsProps {
    targetSellerId?: string;
    targetSellerName?: string;
    targetSellerAvatar?: string;
}

/**
 * Gộp tất cả nút nổi góc phải dưới màn hình:
 *   - CategoryFloatingButton (chỉ ở "/") — xanh primary, icon danh mục
 *   - AIChatbot — tím, trợ lý AI
 *   - FloatingChat — xanh, chat người bán
 */
export const BuyerFloatingButtons: React.FC<BuyerFloatingButtonsProps> = (props) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Nút danh mục (chỉ hiện ở trang chủ "/") */}
            <CategoryFloatingButton />

            {/* Chatbot AI (tím) */}
            <AIChatbot />

            {/* Chat người bán (xanh) */}
            <FloatingChat embedded {...props} />
        </div>
    );
};
