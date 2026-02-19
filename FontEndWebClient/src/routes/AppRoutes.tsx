import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { FarmerSidebar } from '../components/layout/FarmerSidebar';
import { DashboardLayoutFarmer } from '../components/layout/DashboardLayoutFarmer';
import { MyProductPage } from '../pages/farmer/MyProductPage';
import { FarmingLogsPage } from '../pages/farmer/FarmingLogsPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Pages (Lazy loading)
const FarmerDashboard = lazy(() => import('../pages/farmer/FarmerDashboard'));

// Mock Component Loading
const Loading = () => <div className="p-10 text-center text-primary">Đang tải...</div>;
const PublicLayout = () => <div><nav className="p-4 border-b">Header Public</nav><Outlet /></div>;

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route>
                    <Route path="/" element={<div>Trang chủ</div>} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/register" element={<RegisterPage/>} />
                </Route>

                {/* ================= PROTECTED ROUTES ================= */}

                {/* 1. NÔNG DÂN (FARMER) */}
                <Route path="/farmer" element={<DashboardLayoutFarmer sidebar={<FarmerSidebar />} />}>
                    <Route index element={<Navigate to="dashboard" />} />

                    <Route path="dashboard" element={<FarmerDashboard />} />
                    <Route path="products" element={<MyProductPage />} />
                    <Route path="orders" element={<div>Quản lý Đơn hàng</div>} />
                    <Route path="contracts" element={<div>Quản lý Hợp đồng</div>} />
                    <Route path="logs" element={<FarmingLogsPage />} />
                    <Route path="settings" element={<div>Cài đặt</div>} />
                </Route>

                {/* 2. THƯƠNG LÁI (TRADER) */}
                {/* <Route path="/trader" element={<DashboardLayout sidebar={<div className="w-64 bg-blue-50 p-4">Trader Sidebar</div>} />}>
                    <Route index element={<Navigate to="market" />} />
                    <Route path="market" element={<div>Chợ Sỉ</div>} />
                </Route> */}

                {/* 3. ADMIN */}
                {/* <Route path="/admin" element={<DashboardLayout sidebar={<div className="w-64 bg-gray-800 text-white p-4">Admin Sidebar</div>} />}>
                    <Route path="users" element={<div>Quản lý User</div>} />
                </Route> */}

                {/* ================= 404 ================= */}
                <Route path="*" element={<div className="text-center mt-20 text-red-500">404 - Not Found</div>} />
            </Routes>
        </Suspense>
    );
}