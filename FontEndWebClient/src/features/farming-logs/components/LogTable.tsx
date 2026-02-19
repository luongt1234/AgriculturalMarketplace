import React from 'react';
import type { FarmingLog } from '../../../types/farming-logs.type';

interface LogTableProps {
    logs: FarmingLog[];
}

export const LogTable: React.FC<LogTableProps> = ({ logs }) => {
    return (
        <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-[#f9faf9] dark:bg-[#1f2d21] border-b border-[#f1f3f1] dark:border-gray-700 sticky top-0 z-10">
                    <tr>
                        <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Thời gian</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Loại giao dịch</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Block Hash</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Số Block</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Trạng thái</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-[#131613] dark:text-gray-200 divide-y divide-[#f1f3f1] dark:divide-[#2f3a30]">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#f9faf9] dark:hover:bg-[#1e2a1f] transition-colors group">
                            <td className="py-4 px-6 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                <div className="font-medium">{log.timestamp.date}</div>
                                <div className="text-xs text-[#6b806c] dark:text-gray-500">{log.timestamp.time}</div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <span className={`p-1.5 rounded ${log.transactionType.colorClass}`}>
                                        <span className="material-symbols-outlined text-[18px] block">{log.transactionType.icon}</span>
                                    </span>
                                    <span className="font-medium">{log.transactionType.label}</span>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2 group/hash cursor-pointer" title="Copy Hash">
                                    <span className="font-mono text-[#6b806c] dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                                        {log.blockHash}
                                    </span>
                                    <span className="material-symbols-outlined text-[14px] text-[#6b806c] opacity-0 group-hover/hash:opacity-100 transition-opacity">content_copy</span>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-[#6b806c] dark:text-gray-400 font-mono">{log.blockNumber}</td>
                            <td className="py-4 px-6">
                                {log.status === 'Confirmed' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-primary dark:text-green-400 border border-green-100 dark:border-green-900/30">
                                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                        Xác nhận
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                        <span className="material-symbols-outlined text-[14px]">pending</span>
                                        Chờ xử lý
                                    </span>
                                )}
                            </td>
                            <td className="py-4 px-6 text-right">
                                <button className="text-xs font-bold text-primary dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors inline-flex items-center gap-1">
                                    Chi tiết <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};