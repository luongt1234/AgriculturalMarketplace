// src/pages/farmer/FarmerDashboard.tsx
import React from 'react';
import { StatCard } from '../../features/stats/components/StatCard';
import { RevenueChart } from '../../features/stats/components/RevenueChart';
import { ActionCenter } from './components/ActionCenter';
import { RecentOrdersTable } from '../../features/orders/components/RecentOrdersTable';
import { useFarmerStats } from '../../features/stats/hooks/useStats';

const FarmerDashboard: React.FC = () => {
    const { data: statsData, isLoading } = useFarmerStats();

    if (isLoading) {
        return <div className="p-6">Đang tải dữ liệu...</div>;
    }

    const data: any = statsData || {};

    console.log({ data });


    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng doanh thu"
                    value={`${data?.tongDoanhThu?.toLocaleString('vi-VN')}₫`}
                    trend={`${data?.bieuDoDoanhThu_TangGiamPhanTram}%`}
                    trendLabel="so với tuần trước"
                    icon="payments"
                    colorClass="primary"
                />
                <StatCard
                    title="Đơn chờ xử lý"
                    value={data?.donChoXuLy?.toString() || '0'}
                    trend={`+${data?.donMoiNhat || 0} Đơn`}
                    trendLabel="mới hôm nay"
                    icon="pending_actions"
                    colorClass="blue"
                />
                <StatCard
                    title="Sản phẩm sắp hết"
                    value={data?.sanPhamSapHet?.toString() || '0'}
                    trend="Cần nhập"
                    trendLabel=""
                    icon="inventory"
                    colorClass="orange"
                />
                <StatCard
                    title="Đánh giá Shop"
                    value={`${data?.danhGiaShop || 0} / 5.0`}
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