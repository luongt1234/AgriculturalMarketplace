// src/pages/farmer/FarmerDashboard.tsx
import React from 'react';
import { StatCard } from '../../features/stats/components/StatCard';
import { RevenueChart } from '../../features/stats/components/RevenueChart';
import { ActionCenter } from './components/ActionCenter';
import { RecentOrdersTable } from '../../features/orders/components/RecentOrdersTable';

const FarmerDashboard: React.FC = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng doanh thu"
                    value="12,450,000₫"
                    trend="12%"
                    trendLabel="so với tuần trước"
                    icon="payments"
                    colorClass="primary"
                />
                <StatCard
                    title="Đơn chờ xử lý"
                    value="3"
                    trend="+2 Đơn"
                    trendLabel="mới hôm nay"
                    icon="pending_actions"
                    colorClass="blue"
                />
                <StatCard
                    title="Sản phẩm sắp hết"
                    value="5"
                    trend="Cần nhập"
                    trendLabel=""
                    icon="inventory"
                    colorClass="orange"
                />
                <StatCard
                    title="Đánh giá Shop"
                    value="4.8 / 5.0"
                    trend="+0.1"
                    trendLabel="30 ngày qua"
                    icon="star"
                    colorClass="yellow"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <RevenueChart />
                <ActionCenter />
            </div>

            <RecentOrdersTable />
        </>
    );
};

export default FarmerDashboard;