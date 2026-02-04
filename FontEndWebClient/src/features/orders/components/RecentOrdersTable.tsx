import React from 'react';

// Giả lập dữ liệu hoặc nhận từ Props
const orders = [
    { id: '#AG-7782', product: 'Lúa mì hữu cơ (50kg)', img: 'https://via.placeholder.com/50', date: '29/05/2023', amount: '4.500.000₫', status: 'Pending' },
    { id: '#AG-7781', product: 'Táo đỏ (Thùng)', img: 'https://via.placeholder.com/50', date: '28/05/2023', amount: '1.200.000₫', status: 'Shipped' },
];

export const RecentOrdersTable: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f1f3f1] dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-[#131613] dark:text-white text-lg font-bold leading-tight">Đơn hàng gần đây</h3>
                <a className="text-sm font-semibold text-primary hover:text-green-800 transition-colors" href="#">Xem tất cả</a>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f9faf9] dark:bg-white/5 border-b border-[#f1f3f1] dark:border-gray-700">
                            <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Mã đơn</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Sản phẩm</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Ngày đặt</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Tổng tiền</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400">Trạng thái</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#6b806c] dark:text-gray-400 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-[#131613] dark:text-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-[#f1f3f1] dark:border-gray-700 hover:bg-[#f9faf9] dark:hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6 font-medium">{order.id}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded bg-gray-100 dark:bg-gray-700 bg-center bg-cover" style={{ backgroundImage: `url("${order.img}")` }}></div>
                                        <span>{order.product}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-[#6b806c] dark:text-gray-400">{order.date}</td>
                                <td className="py-4 px-6 font-medium">{order.amount}</td>
                                <td className="py-4 px-6">
                                    {order.status === 'Pending' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30">
                                            <span className="size-1.5 rounded-full bg-yellow-500"></span> Chờ xử lý
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-primary dark:text-green-400 border border-green-100 dark:border-green-900/30">
                                            <span className="size-1.5 rounded-full bg-primary"></span> Đã gửi
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-[#6b806c] hover:text-primary transition-colors material-symbols-outlined text-[20px]">more_vert</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};