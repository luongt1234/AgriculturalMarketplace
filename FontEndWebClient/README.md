# React + TypeScript + Vite

Khung dự án
src/
├── assets/                       # Tài nguyên tĩnh (Images, Global CSS, Fonts)
│   ├── images/
│   └── styles/                   # global.css (Tailwind directives)
│
├── lib/                          # Cấu hình các thư viện bên thứ 3
│   ├── axios.ts                  # Cấu hình Axios Interceptors (Auth token)
│   ├── query-client.ts           # Cấu hình TanStack Query
│   └── utils.ts                  # Hàm tiện ích UI (vd: cn() cho tailwind)
│
├── constants/                    # Các hằng số toàn cục
│   ├── api-endpoints.ts          # Đường dẫn API
│   ├── roles.ts                  # ENUM Role: Nông dân, Thương lái, Admin
│   └── status.ts                 # Mapping trạng thái đơn hàng/hợp đồng (từ SQL)
│
├── types/                        # TypeScript Definitions (Mapping từ DB)
│   ├── auth.types.ts             # User, LoginResponse
│   ├── product.types.ts          # SanPhamDang, SanPhamChung, NhatKySanPham
│   ├── order.types.ts            # DonHang, ChiTietDonHang
│   └── contract.types.ts         # HopDongBaoTieu
│
├── store/                        # Global State Management (Zustand)
│   ├── useAuthStore.ts           # Lưu User Info, Token
│   ├── useCartStore.ts           # Giỏ hàng (Persist local storage)
│   └── useUIStore.ts             # Trạng thái Sidebar, Toast, Modal
│
├── components/                   # SHARED UI COMPONENTS (Dùng chung toàn app)
│   ├── ui/                       # Base Components (Button, Input, Select, Badge...)
│   ├── common/                   # Components phức tạp hơn
│   │   ├── DataTable.tsx         # Bảng dữ liệu có phân trang/lọc
│   │   ├── ConfirmModal.tsx
│   │   ├── ImageUpload.tsx       # Component upload ảnh nông sản
│   │   └── StatusBadge.tsx       # Hiển thị màu trạng thái (Hoàn tất/Hủy)
│   └── layout/                   # Các phần nhỏ của Layout (Sidebar, Header)
│
├── features/                     # FEATURE-BASED MODULES (Nghiệp vụ cốt lõi)
│   ├── auth/                     # Xác thực
│   │   ├── components/           # LoginForm, RegisterForm, ProfileUpdate
│   │   └── api/                  # authApi.login, authApi.register
│   │
│   ├── products/                 # Quản lý nông sản
│   │   ├── components/           # ProductList, ProductForm, ProductFilter
│   │   ├── hooks/                # useProducts, useProductDetail
│   │   └── api/                  # createProduct, getProducts
│   │
│   ├── farming-logs/             # [NEW] Nhật ký canh tác & Truy xuất nguồn gốc
│   │   ├── components/           # LogTimeline (Hiển thị quy trình), QRCodeGenerator
│   │   └── api/                  # addLog, getLogsByProduct
│   │
│   ├── orders/                   # Quản lý đơn hàng & Checkout
│   │   ├── components/           # OrderTable, OrderDetailDialog, CheckoutForm
│   │   └── hooks/                # useMyOrders, useUpdateOrderStatus
│   │
│   ├── contracts/                # [NEW] Hợp đồng bao tiêu (B2B)
│   │   ├── components/           # ContractList, ContractSignModal
│   │   └── api/                  # getContracts, signContract
│   │
│   ├── chat/                     # Chat Realtime
│   │   ├── components/           # ChatWindow, UserList
│   │   └── services/             # SignalRService.ts (Kết nối WebSocket)
│   │
│   └── stats/                    # [NEW] Thống kê & Báo cáo
│       └── components/           # RevenueChart, TopProductsChart
│
├── layouts/                      # BỐ CỤC TRANG (LAYOUTS)
│   ├── MainLayout.tsx            # Header + Footer + Outlet (Cho khách vãng lai)
│   ├── AuthLayout.tsx            # Center box (Cho Login/Register)
│   ├── DashboardLayout.tsx       # [Gộp] Sidebar + Header (Dùng chung logic Layout)
│   │                             # (Render Sidebar khác nhau dựa trên props role)
│   └── components/
│       ├── FarmerSidebar.tsx
│       ├── TraderSidebar.tsx
│       └── AdminSidebar.tsx
│
├── pages/                        # PAGES (Kết nối Features vào Route)
│   ├── public/                   # Public Pages
│   │   ├── HomePage.tsx          # Landing Page
│   │   ├── ProductDetailPage.tsx # Xem chi tiết, Log canh tác, Đánh giá
│   │   ├── CartPage.tsx          # Xem giỏ hàng
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── farmer/                   # Nông dân (Seller)
│   │   ├── FarmerDashboard.tsx   # Thống kê nhanh
│   │   ├── MyProductPage.tsx     # CRUD Sản phẩm
│   │   ├── OrderManagePage.tsx   # Quản lý đơn bán
│   │   └── ContractPage.tsx      # Quản lý hợp đồng
│   │
│   ├── trader/                   # Thương lái/Doanh nghiệp (Buyer)
│   │   ├── MarketPlacePage.tsx   # Chợ mua sỉ (Bộ lọc nâng cao)
│   │   ├── MyOrderPage.tsx       # Lịch sử mua hàng
│   │   └── RequestPage.tsx       # Yêu cầu đặt hàng (Pre-order)
│   │
│   └── admin/                    # Admin
│       ├── UserManagePage.tsx    # Duyệt doanh nghiệp, khóa user
│       └── SystemConfigPage.tsx  # Quản lý danh mục
│
├── routes/                       # ROUTING
│   ├── AppRoutes.tsx             # Định nghĩa toàn bộ luồng
│   ├── PrivateRoute.tsx          # Check login
│   └── RoleGuard.tsx             # Check quyền (Farmer vs Trader)
│
└── main.tsx                      # Entry Point