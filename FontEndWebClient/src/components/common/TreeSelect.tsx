import React, { useMemo } from 'react';

// Sử dụng Generic Type <T> để Component có thể nhận bất kỳ object nào
interface GenericTreeSelectProps<T> {
    data: T[];
    value?: string | number;
    onChange: (value: string) => void;

    // Định nghĩa các key sẽ lấy làm label, value từ bên ngoài
    labelField: keyof T;
    valueField: keyof T;
    childrenField?: keyof T; // Mặc định là 'children'
    parentField?: keyof T;   // (Tùy chọn) Dùng để lọc node gốc nếu mảng truyền vào bị phẳng

    placeholder?: string;
    className?: string;
}

const TreeSelect = <T extends Record<string, any>>({
    data,
    value,
    onChange,
    labelField,
    valueField,
    childrenField = 'children' as keyof T,
    parentField,
    placeholder = "--- Chọn giá trị ---",
    className = ""
}: GenericTreeSelectProps<T>) => {
    const renderOptions = (items: T[], level: number = 0) => {
        return items.map((item) => {
            // Ép kiểu an toàn do T là dynamic object
            const itemValue = item[valueField] as unknown as string | number;
            const itemLabel = item[labelField] as unknown as string;
            const children = item[childrenField] as unknown as T[];

            return (
                <React.Fragment key={String(itemValue)}>
                    <option value={itemValue}>
                        {"\u00A0\u00A0".repeat(level * 2)}
                        {level > 0 ? `↳ ${itemLabel}` : itemLabel}
                    </option>

                    {/* Gọi lại đệ quy nếu có children */}
                    {children && children.length > 0 && renderOptions(children, level + 1)}
                </React.Fragment>
            );
        });
    };

    const rootNodes = useMemo(() => {
        if (!parentField) return data;
        return data.filter(item => !item[parentField] || item[parentField] === null);
    }, [data, parentField]);

    return (
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 outline-none ${className}`}
        >
            <option value="">{placeholder}</option>
            {renderOptions(rootNodes)}
        </select>
    );
};

export default TreeSelect;