import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { FarmerSidebar } from '../components/layout/FarmerSidebar';
import { DashboardLayoutFarmer } from '../components/layout/DashboardLayoutFarmer';
import { MyProductPage } from '../pages/farmer/MyProductPage';
import { FarmingLogsPage } from '../pages/farmer/FarmingLogsPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { PrivateRoute } from './PrivateRoute';
import { RoleGuard } from './RoleGuard';
import { UnauthorizedPage } from '../pages/public/UnauthorizedPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import BuyerManagement from '../pages/admin/BuyerManagement';
import SellerManagement from '../pages/admin/SellerManagement';
import AdminManagement from '../pages/admin/AdminManagement';

const FarmerDashboard = lazy(() => import('../pages/farmer/FarmerDashboard'));

const Loading = () => <div className="p-10 text-center text-primary">Đang tải...</div>;

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route>
                    <Route path="/" element={<div>Trang chủ</div>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                {/* ================= PROTECTED ROUTES ================= */}

                <Route element={<PrivateRoute />}>
                    {/* 1. NÔNG DÂN (FARMER) */}
                    <Route element={<RoleGuard allowedRoles={['NONG_DAN']} />}>
                        <Route path="/farmer" element={<DashboardLayoutFarmer sidebar={<FarmerSidebar />} />}>
                            <Route index element={<Navigate to="dashboard" />} />

                            <Route path="dashboard" element={<FarmerDashboard />} />
                            <Route path="products" element={<MyProductPage />} />
                            <Route path="orders" element={<div>Quản lý Đơn hàng</div>} />
                            <Route path="contracts" element={<div>Quản lý Hợp đồng</div>} />
                            <Route path="logs" element={<FarmingLogsPage />} />
                            <Route path="settings" element={<div>Cài đặt</div>} />
                        </Route>
                    </Route>
                    {/* 2. THƯƠNG LÁI (TRADER) */}
                    {/* <Route path="/trader" element={<DashboardLayout sidebar={<div className="w-64 bg-blue-50 p-4">Trader Sidebar</div>} />}>
                        <Route index element={<Navigate to="market" />} />
                        <Route path="market" element={<div>Chợ Sỉ</div>} />
                    </Route> */}

                    {/* 3. ADMIN */}
                    <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="dashboard" />} />
                            <Route path="buyer" element={<BuyerManagement />} />
                            <Route path="seller" element={<SellerManagement />} />
                            <Route path="admin-managenent" element={<AdminManagement />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="category" element={<div>Quản lý danh mục</div>} />
                            <Route path="users" element={<div>Quản lý User</div>} />

                        </Route>
                    </Route>
                </Route>

                {/* ================= 404 ================= */}
                <Route path="*" element={<div className="text-center mt-20 text-red-500">404 - Not Found</div>} />
            </Routes>
        </Suspense>
    );
}