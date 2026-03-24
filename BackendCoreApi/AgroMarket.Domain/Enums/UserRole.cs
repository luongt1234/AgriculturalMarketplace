using System;

namespace AgroMarket.Domain.Enums
{
    /// <summary>
    /// Sử dụng hằng số chuỗi thay vì enum truyền thống để tương thích tốt nhất với JWT và DB.
    /// </summary>
    public static class UserRole
    {
        public const string Admin = "ADMIN";
        public const string Buyer = "THUONG_LAI";
        public const string Seller = "NONG_DAN";
        // public const string DoanhNghiep = "DOANH_NGHIEP";
    }
}