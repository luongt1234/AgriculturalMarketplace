import React, { useMemo, useState } from 'react';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import { LogStatCards } from '../../features/farming-logs/components/LogStatCards';
import { LogTable } from '../../features/farming-logs/components/LogTable';
import type { FarmingLog } from '../../types/farming-logs.type';


// --- MOCK DATA ---
const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Cà phê Robusta Đắk Lắk S18', sku: 'CF-ROB-001', imageUrl: 'https://via.placeholder.com/150', status: 'active' },
    { id: 'p2', name: 'Gạo ST25 Sóc Trăng', sku: 'RICE-ST25', imageUrl: 'https://via.placeholder.com/150', status: 'active' },
    { id: 'p3', name: 'Sầu riêng Ri6 Hữu cơ', sku: 'DUR-RI6-02', imageUrl: 'https://via.placeholder.com/150', status: 'out_of_stock' },
];

const MOCK_LOGS: FarmingLog[] = [
    {
        id: '1',
        timestamp: { date: '29 Th05, 2026', time: '14:32:05 UTC' },
        transactionType: { label: 'Vận chuyển nông sản', icon: 'local_shipping', colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
        blockHash: '0x7f2a...9b1c',
        blockNumber: '#14,205,890',
        status: 'Confirmed'
    },
    {
        id: '2',
        timestamp: { date: '28 Th05, 2026', time: '09:15:22 UTC' },
        transactionType: { label: 'Chứng nhận VietGAP', icon: 'verified', colorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
        blockHash: '0x3c4d...8e2f',
        blockNumber: '#14,205,812',
        status: 'Confirmed'
    },
    {
        id: '3',
        timestamp: { date: '27 Th05, 2026', time: '16:45:10 UTC' },
        transactionType: { label: 'Cập nhật Thu hoạch', icon: 'agriculture', colorClass: 'bg-green-50 text-primary dark:bg-green-900/20 dark:text-green-400' },
        blockHash: '0x9a8b...1f2e',
        blockNumber: '#14,204,550',
        status: 'Confirmed'
    }
];

export const FarmingLogsPage = () => {
    // State chọn sản phẩm
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Giả lập Fetch Logs dựa trên Product ID
    const [logs, setLogs] = useState<FarmingLog[]>(MOCK_LOGS);

    const headerAction = useMemo(() => (
        <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100 dark:border-blue-900/30">
                Sổ cái Blockchain
            </span>
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white hover:bg-[#246328] font-bold shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Thêm Log mới
            </button>
        </div>
    ), []);

    useSetPageTitle('Nhật ký Canh tác', headerAction);

    // Lọc sản phẩm theo tìm kiếm
    const filteredProducts = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-6">

            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM (Master) */}
            <div className="w-full md:w-80 flex flex-col bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm overflow-hidden shrink-0">
                <div className="p-4 border-b border-[#f1f3f1] dark:border-gray-700">
                    <h3 className="font-bold text-[#131613] dark:text-white mb-3">Chọn Lô hàng / Sản phẩm</h3>
                    <label className="flex items-center h-9 w-full rounded-lg bg-[#f1f3f1] dark:bg-[#253326] overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                        <span className="material-symbols-outlined text-[#6b806c] pl-3 text-[18px]">search</span>
                        <input
                            className="w-full bg-transparent border-none text-[#131613] dark:text-white placeholder:text-[#6b806c] text-sm focus:outline-none focus:ring-0 h-full pl-2"
                            placeholder="Tên, mã SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className={`p-4 border-b border-[#f1f3f1] dark:border-gray-700 cursor-pointer transition-colors flex gap-3 items-center
                                ${selectedProduct?.id === product.id
                                    ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary'
                                    : 'hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-l-transparent'
                                }
                            `}
                        >
                            <div
                                className="size-10 rounded-md bg-cover bg-center shrink-0 border border-gray-200 dark:border-gray-600"
                                style={{ backgroundImage: `url('${product.imageUrl}')` }}
                            />
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-sm text-[#131613] dark:text-white truncate" title={product.name}>
                                    {product.name}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-[#6b806c] font-mono">{product.sku}</span>
                                    <span className={`size-2 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CỘT PHẢI: CHI TIẾT LOG (Detail) */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                {!selectedProduct ? (
                    // Màn hình trống (Empty State) khi chưa chọn sản phẩm
                    <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-[#dee3de] dark:text-gray-600 mb-4">qr_code_scanner</span>
                        <h3 className="text-lg font-bold text-[#131613] dark:text-white">Chưa chọn lô hàng</h3>
                        <p className="text-sm text-[#6b806c] dark:text-gray-400 mt-1 max-w-sm text-center">
                            Vui lòng chọn một sản phẩm ở danh sách bên trái để xem lịch sử truy xuất nguồn gốc và sổ cái blockchain.
                        </p>
                    </div>
                ) : (
                    // Nội dung Log khi ĐÃ CHỌN sản phẩm
                    <div className="flex flex-col h-full gap-6 overflow-y-auto custom-scrollbar pr-2">

                        {/* Header thông tin sản phẩm đang chọn */}
                        <div className="bg-white dark:bg-[#1a261c] rounded-xl p-4 border border-[#dee3de] dark:border-gray-700 shadow-sm flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-lg bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url('${selectedProduct.imageUrl}')` }} />
                                <div>
                                    <h2 className="font-bold text-lg text-[#131613] dark:text-white">{selectedProduct.name}</h2>
                                    <p className="text-sm text-[#6b806c]">Truy xuất nguồn gốc Blockchain (SKU: {selectedProduct.sku})</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-[#dee3de] dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 text-[#131613] dark:text-white">
                                <span className="material-symbols-outlined text-[18px]">qr_code_2</span> Xuất mã QR
                            </button>
                        </div>

                        {/* Thống kê Log */}
                        <LogStatCards />

                        {/* Bảng Dữ liệu Log */}
                        <div className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm flex flex-col flex-1 min-h-[400px] overflow-hidden">
                            <div className="p-4 border-b border-[#f1f3f1] dark:border-gray-700 flex justify-between items-center bg-[#f9faf9] dark:bg-[#1f2d21]">
                                <h3 className="font-bold text-[#131613] dark:text-white">Lịch sử sự kiện ({logs.length})</h3>
                                <button className="text-sm text-primary hover:underline font-medium">Xem Smart Contract</button>
                            </div>

                            {/* Kế thừa LogTable từ component bạn đã tách */}
                            <LogTable logs={logs} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};