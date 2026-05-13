namespace AgroMarket.Domain.Enums
{
    public static class AdminFeaturePermission
    {
        public const string Dashboard = "ADMIN_DASHBOARD";
        public const string BuyerManagement = "ADMIN_BUYER";
        public const string SellerManagement = "ADMIN_SELLER";
        public const string AdminAccountManagement = "ADMIN_ADMIN_ACCOUNTS";
        public const string CategoryManagement = "ADMIN_CATEGORY";
        public const string VoucherManagement = "ADMIN_VOUCHER";
        public const string ThemeSettings = "ADMIN_SETTINGS";
        public const string PermissionManagement = "ADMIN_PERMISSIONS";
        public const string ConfiguredMarker = "__ADMIN_PERMISSIONS_CONFIGURED__";

        public static readonly IReadOnlyDictionary<string, string> Labels = new Dictionary<string, string>
        {
            [Dashboard] = "Tổng quan",
            [BuyerManagement] = "Quản lý người mua",
            [SellerManagement] = "Quản lý người bán",
            [AdminAccountManagement] = "Quản lý tài khoản quản trị",
            [CategoryManagement] = "Quản lý danh mục",
            [VoucherManagement] = "Quản lý Voucher",
            [ThemeSettings] = "Cài đặt giao diện",
            [PermissionManagement] = "Phân quyền"
        };

        public static IReadOnlyCollection<string> All => Labels.Keys.ToArray();
    }
}
