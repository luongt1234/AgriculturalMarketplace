import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// --- MOCK COMPONENTS (Xóa đi khi bạn đã tạo Page thật) ---
const Loading = () => <div className="p-10 text-center text-primary">Đang tải...</div>;
const PublicLayout = () => <div><nav className="p-4 border-b bg-white shadow-sm">Header (Logo | Search | Cart)</nav><Outlet /></div>;
const DashboardLayout = () => <div className="flex"><aside className="w-64 bg-green-50 h-screen p-4 border-r">Sidebar</aside><main className="flex-1 p-6"><Outlet /></main></div>;

// --- LAZY LOAD PAGES (Tối ưu hiệu năng) ---
// const HomePage = lazy(() => import('@/pages/public/HomePage'));
// const LoginPage = lazy(() => import('@/pages/public/LoginPage'));

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<div className="p-10 font-bold text-2xl text-primary">Trang chủ (Storefront)</div>} />
                    <Route path="/product/:id" element={<div>Chi tiết sản phẩm</div>} />
                    <Route path="/cart" element={<div>Giỏ hàng</div>} />
                    <Route path="/login" element={<div className="p-10">Form Đăng nhập</div>} />
                </Route>

                {/* ================= PROTECTED ROUTES ================= */}

                {/* 1. NÔNG DÂN (FARMER) */}
                <Route path="/farmer" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<div>Dashboard Nông Dân</div>} />
                    <Route path="products" element={<div>Quản lý Kho Nông Sản</div>} />
                    <Route path="farming-logs" element={<div>Nhật ký canh tác (Blockchain)</div>} />
                </Route>

                {/* 2. THƯƠNG LÁI (TRADER/BUYER) */}
                <Route path="/trader" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="market" />} />
                    <Route path="market" element={<div>Chợ Sỉ (B2B Market)</div>} />
                    <Route path="contracts" element={<div>Hợp đồng Bao tiêu</div>} />
                </Route>

                {/* 3. ADMIN */}
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="users" element={<div>Quản lý User</div>} />
                </Route>

                {/* ================= 404 ================= */}
                <Route path="*" element={<div className="text-center mt-20 text-red-500">404 - Không tìm thấy trang</div>} />
            </Routes>
        </Suspense>
    );
}