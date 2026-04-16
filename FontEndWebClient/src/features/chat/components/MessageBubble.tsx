import React from 'react';
import type { Message } from '../types/chat.types';

interface MessageBubbleProps {
    message: Message;
    isMine: boolean;
}

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
    return (
        <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar người gửi (chỉ hiện bên trái cho tin của người kia) */}
            {!isMine && (
                <div
                    className="w-7 h-7 rounded-full bg-gray-200 bg-cover bg-center shrink-0 border border-gray-200"
                    style={{
                        backgroundImage: message.anhDaiDienNguoiGui
                            ? `url('${message.anhDaiDienNguoiGui}')`
                            : undefined,
                    }}
                >
                    {!message.anhDaiDienNguoiGui && (
                        <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[14px]">person</span>
                        </div>
                    )}
                </div>
            )}

            <div className={`flex flex-col gap-0.5 max-w-[72%] ${isMine ? 'items-end' : 'items-start'}`}>
                <div
                    className={`
                        px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words
                        ${isMine
                            ? 'bg-primary text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-sm shadow-sm'
                        }
                    `}
                >
                    {message.noiDung}
                </div>
                <span className="text-[10px] text-gray-400 px-1">
                    {formatTime(message.thoiGian)}
                </span>
            </div>
        </div>
    );
};
