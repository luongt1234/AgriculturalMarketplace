import React, { useRef, useState } from 'react';

interface ChatInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    disabled = false,
    placeholder = 'Nhập tin nhắn...',
}) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1a261c]">
            <div className="flex-1 relative">
                <textarea
                    ref={inputRef}
                    rows={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full resize-none max-h-28 overflow-y-auto px-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all leading-relaxed"
                    style={{ minHeight: '42px' }}
                />
            </div>
            <button
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className="shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-[#246328] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
                <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
        </div>
    );
};
