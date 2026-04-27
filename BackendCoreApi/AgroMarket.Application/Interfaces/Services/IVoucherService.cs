using AgroMarket.Application.DTOs.Voucher;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IVoucherService
    {
        // Admin
        Task<IEnumerable<VoucherDto>> GetAdminVouchersAsync();
        Task<VoucherDto> CreateAdminVoucherAsync(CreateVoucherDto dto);

        // Farmer
        Task<IEnumerable<VoucherDto>> GetFarmerVouchersAsync(Guid nguoiBanId);
        Task<VoucherDto> CreateFarmerVoucherAsync(CreateVoucherDto dto, Guid nguoiBanId);

        // Shared
        Task<VoucherDto> UpdateVoucherAsync(Guid id, UpdateVoucherDto dto, Guid requestUserId, bool isAdmin);
        Task DeleteVoucherAsync(Guid id, Guid requestUserId, bool isAdmin);

        // Buyer: view & claim shop vouchers
        Task<IEnumerable<VoucherPublicDto>> GetShopVouchersAsync(Guid sellerId, Guid? currentUserId);
        Task<string> ClaimVoucherAsync(Guid voucherId, Guid userId);

        // Buyer: my vouchers
        Task<IEnumerable<VoucherDto>> GetMyVouchersAsync(Guid userId);

        // Validate at checkout
        Task<ValidateVoucherResultDto> ValidateVoucherAsync(string code, Guid userId, decimal tongTienDonHang, List<Guid> sanPhamDangIds);

        // Get discount info for products (for homepage display)
        Task<Dictionary<Guid, decimal>> GetActiveDiscountForProductsAsync(List<Guid> sanPhamDangIds);
    }
}
