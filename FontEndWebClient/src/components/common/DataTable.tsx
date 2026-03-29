// src/components/common/DataTable.tsx
import React from 'react';

export interface Column<T> {
    header: string;
    key: keyof T | string;
    className?: string;
    render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    pagination?: {
        pageNumber: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
    emptyMessage?: string;
}

export function DataTable<T>({ data, columns, loading, pagination, emptyMessage }: DataTableProps<T>) {
    const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0;

    return (
        <div className="bg-white dark:bg-[#1a261c] border border-[#dee3de] dark:border-gray-700 rounded-b-xl overflow-x-auto shadow-sm">
            <table className="w-full min-w-[800px] text-left border-collapse">
                <thead className="bg-[#f9faf9] dark:bg-[#1f2d21] border-b border-[#dee3de] dark:border-gray-700">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#6b806c] dark:text-gray-400 ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f1] dark:divide-gray-700">
                    {loading ? (
                        <tr><td colSpan={columns.length} className="py-10 text-center text-primary">Đang tải dữ liệu...</td></tr>
                    ) : data.length > 0 ? (
                        data.map((item, idx) => (
                            <tr key={idx} className="group hover:bg-[#f1f3f1]/50 dark:hover:bg-white/5 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`py-4 px-6 ${col.className || ''}`}>
                                        {col.render ? col.render(item, idx) : (item as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-20 text-center text-[#6b806c]">
                                {emptyMessage || "Không có dữ liệu hiển thị."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Bar */}
            {pagination && totalPages > 1 && (
                <div className="bg-[#f9faf9] dark:bg-[#1f2d21] px-6 py-4 border-t border-[#dee3de] dark:border-gray-700 flex items-center justify-between">
                    <p className="text-xs font-medium text-[#6b806c]">Tổng số: {pagination.total} bản ghi</p>
                    <div className="flex gap-1">
                        <button
                            disabled={pagination.pageNumber === 1}
                            onClick={() => pagination.onPageChange(pagination.pageNumber - 1)}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-1 text-sm font-bold bg-primary text-white rounded">
                            {pagination.pageNumber} / {totalPages}
                        </span>
                        <button
                            disabled={pagination.pageNumber === totalPages}
                            onClick={() => pagination.onPageChange(pagination.pageNumber + 1)}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}