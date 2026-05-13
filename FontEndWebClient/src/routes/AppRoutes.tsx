import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { FarmerSidebar } from '../components/layout/FarmerSidebar';
import { DashboardLayoutFarmer } from '../components/layout/DashboardLayoutFarmer';
import { MyProductPage } from '../pages/farmer/MyProductPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { PrivateRoute } from './PrivateRoute';
import { RoleGuard } from './RoleGuard';
import { AdminPermissionGuard } from './AdminPermissionGuard';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import BuyerManagement from '../pages/admin/BuyerManagement';
import SellerManagement from '../pages/admin/SellerManagement';
import AdminManagement from '../pages/admin/AdminManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import SettingsPage from '../pages/admin/SettingsPage';
import PermissionsPage from '../pages/admin/PermissionsPage';
import { UnauthorizedPage } from '../pages/public/UnauthorizedPage';
import BuyerPage from '../pages/buyer/BuyerPage';
import SearchResultsPage from '../pages/buyer/SearchResultsPage';
import ProductDetailPage from '../pages/buyer/ProductDetailPage';
import { CheckoutPage } from '../pages/buyer/CheckoutPage';
import AboutPage from '../pages/public/AboutPage';
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/public/TermsOfServicePage';
import FarmerChatPage from '../pages/farmer/ChatPage';
import SellerStorefrontPage from '../pages/buyer/SellerStorefrontPage';
import SellerSettingsPage from '../pages/farmer/SellerSettingsPage';
import UserProfilePage from '../pages/public/UserProfilePage';
import OrdersPage from '../pages/public/OrdersPage';
import FavoriteProductsPage from '../pages/buyer/FavoriteProductsPage';
import CategoryProductPage from '../pages/buyer/CategoryProductPage';
import VoucherManagement from '../pages/admin/VoucherManagement';
import VoucherPage from '../pages/farmer/VoucherPage';
import SellerOrdersPage from '../pages/farmer/SellerOrdersPage';
import FeaturedProductsPage from '../pages/buyer/FeaturedProductsPage';
import PurchaseStatisticsPage from '../pages/public/PurchaseStatisticsPage';
import { ADMIN_PERMISSIONS } from '../features/admin/constants/adminPermissions';

const FarmerDashboard = lazy(() => import('../pages/farmer/FarmerDashboard'));

const Loading = () => <div className="p-10 text-center text-primary">Đang tải...</div>;

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route>
                    <Route path="/" element={<BuyerPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/featured" element={<FeaturedProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/category/:categoryId" element={<CategoryProductPage />} />
                    <Route path="/shop/:sellerId" element={<SellerStorefrontPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/favorites" element={<FavoriteProductsPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/statistics" element={<PurchaseStatisticsPage />} />

                    <Route element={<RoleGuard allowedRoles={['NONG-DAN']} />}>
                        <Route path="/farmer" element={<DashboardLayoutFarmer sidebar={<FarmerSidebar />} />}>
                            <Route index element={<Navigate to="dashboard" />} />
                            <Route path="dashboard" element={<FarmerDashboard />} />
                            <Route path="products" element={<MyProductPage />} />
                            <Route path="orders" element={<SellerOrdersPage />} />
                            <Route path="chat" element={<FarmerChatPage />} />
                            <Route path="settings" element={<SellerSettingsPage />} />
                            <Route path="vouchers" element={<VoucherPage />} />
                        </Route>
                    </Route>

                    <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="dashboard" />} />

                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.DASHBOARD} />}>
                                <Route path="dashboard" element={<AdminDashboard />} />
                            </Route>
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.BUYER} />}>
                                <Route path="buyer" element={<BuyerManagement />} />
                            </Route>
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.SELLER} />}>
                                <Route path="seller" element={<SellerManagement />} />
                            </Route>
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.ADMIN_ACCOUNTS} />}>
                                <Route path="admin-management" element={<AdminManagement />} />
                            </Route>
                            <Route path="admin-managenent" element={<Navigate to="../admin-management" replace />} />
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.CATEGORY} />}>
                                <Route path="category" element={<CategoryManagement />} />
                            </Route>
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.SETTINGS} />}>
                                <Route path="settings" element={<SettingsPage />} />
                            </Route>
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.VOUCHER} />}>
                                <Route path="vouchers" element={<VoucherManagement />} />
                            </Route>
                            <Route element={<AdminPermissionGuard permission={ADMIN_PERMISSIONS.PERMISSIONS} />}>
                                <Route path="permissions" element={<PermissionsPage />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
