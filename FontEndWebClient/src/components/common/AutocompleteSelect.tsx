import { useState, useEffect, useRef } from 'react';

// Định nghĩa Props sử dụng Generic <T> để nhận mọi loại mảng dữ liệu
interface AutocompleteSelectProps<T> {
    options: T[];
    value: string | number | null; // Giá trị đang được chọn
    onChange: (value: string | number, selectedItem: T) => void;

    // Hai hàm quan trọng giúp component biết cách đọc dữ liệu từ Object T
    getOptionLabel: (item: T) => string;
    getOptionValue: (item: T) => string | number;

    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    error?: string; // Hiển thị lỗi validate
    className?: string;
    noOptionsText?: string;
}

export function AutocompleteSelect<T>({
    options,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    placeholder = 'Chọn một giá trị...',
    disabled = false,
    loading = false,
    error,
    className = '',
    noOptionsText = 'Không tìm thấy kết quả',
}: AutocompleteSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Tìm item đang được chọn dựa trên value prop
    const selectedItem = options.find((opt) => getOptionValue(opt) === value);
    const selectedLabel = selectedItem ? getOptionLabel(selectedItem) : '';

    // Đồng bộ searchTerm với selectedLabel khi value thay đổi từ bên ngoài
    useEffect(() => {
        setSearchTerm(selectedLabel);
    }, [value, selectedLabel]);

    // Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Khôi phục lại text chuẩn nếu người dùng gõ linh tinh mà chưa chọn
                setSearchTerm(selectedLabel);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedLabel]);

    // Lọc danh sách dựa trên từ khóa tìm kiếm
    const filteredOptions = options.filter((opt) => {
        // Nếu user chưa gõ gì (searchTerm vẫn y chang giá trị đang chọn) -> Hiển thị tất cả
        if (searchTerm === selectedLabel) return true;
        return getOptionLabel(opt).toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSelect = (item: T) => {
        const itemValue = getOptionValue(item);
        const itemLabel = getOptionLabel(item);

        onChange(itemValue, item);
        setSearchTerm(itemLabel);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={isOpen ? searchTerm : selectedLabel}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={loading ? 'Đang tải dữ liệu...' : placeholder}
                    disabled={disabled || loading}
                    className={`
                        w-full px-4 py-2.5 rounded-lg border dark:bg-gray-800 transition-colors
                        disabled:cursor-not-allowed disabled:opacity-60
                        ${error
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:border-red-500'
                            : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent'
                        }
                    `}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none material-symbols-outlined text-sm">
                    {loading ? 'sync' : 'expand_more'}
                </span>
            </div>

            {/* Thông báo lỗi nếu có */}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

            {/* Dropdown List */}
            {isOpen && !disabled && !loading && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => {
                            const optValue = getOptionValue(opt);
                            const isSelected = optValue === value;

                            return (
                                <li
                                    key={optValue}
                                    onClick={() => handleSelect(opt)}
                                    className={`
                                        px-4 py-2 text-sm cursor-pointer transition-colors
                                        ${isSelected
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    {getOptionLabel(opt)}
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                            {noOptionsText}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}