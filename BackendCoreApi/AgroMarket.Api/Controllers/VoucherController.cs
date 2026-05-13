using AgroMarket.Application.DTOs.Voucher;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Api.Attributes;
using AgroMarket.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherController : BaseController
    {
        private readonly IVoucherService _voucherService;

        public VoucherController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        private Guid GetUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out var guid))
                throw new UnauthorizedAccessException("Không xác định được người dùng.");
            return guid;
        }

        private bool IsAdmin() => User.IsInRole("ADMIN");

        // ─── Admin ───────────────────────────────────────────────────────────
        [Authorize(Roles = "ADMIN")]
        [RequireAdminPermission(AdminFeaturePermission.VoucherManagement)]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminVouchers()
        {
            try { return Success(await _voucherService.GetAdminVouchersAsync()); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        [Authorize(Roles = "ADMIN")]
        [RequireAdminPermission(AdminFeaturePermission.VoucherManagement)]
        [HttpPost("admin")]
        public async Task<IActionResult> CreateAdminVoucher([FromBody] CreateVoucherDto dto)
        {
            try { return Success(await _voucherService.CreateAdminVoucherAsync(dto)); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        // ─── Farmer ──────────────────────────────────────────────────────────
        [Authorize(Roles = "NONG-DAN")]
        [HttpGet("farmer")]
        public async Task<IActionResult> GetFarmerVouchers()
        {
            try { return Success(await _voucherService.GetFarmerVouchersAsync(GetUserId())); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        [Authorize(Roles = "NONG-DAN")]
        [HttpPost("farmer")]
        public async Task<IActionResult> CreateFarmerVoucher([FromBody] CreateVoucherDto dto)
        {
            try { return Success(await _voucherService.CreateFarmerVoucherAsync(dto, GetUserId())); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        // ─── Shared CRUD ─────────────────────────────────────────────────────
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateVoucher(Guid id, [FromBody] UpdateVoucherDto dto)
        {
            try { return Success(await _voucherService.UpdateVoucherAsync(id, dto, GetUserId(), IsAdmin())); }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { message = ex.Message }); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteVoucher(Guid id)
        {
            try { await _voucherService.DeleteVoucherAsync(id, GetUserId(), IsAdmin()); return Success("Đã xóa voucher."); }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { message = ex.Message }); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        // ─── Buyer: Shop Vouchers ─────────────────────────────────────────────
        [HttpGet("shop/{sellerId:guid}")]
        public async Task<IActionResult> GetShopVouchers(Guid sellerId)
        {
            Guid? userId = null;
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(idStr) && Guid.TryParse(idStr, out var uid)) userId = uid;

            try { return Success(await _voucherService.GetShopVouchersAsync(sellerId, userId)); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        [Authorize]
        [HttpPost("{id:guid}/claim")]
        public async Task<IActionResult> ClaimVoucher(Guid id)
        {
            try
            {
                var code = await _voucherService.ClaimVoucherAsync(id, GetUserId());
                return Success(new { code }, "Lấy voucher thành công!");
            }
            catch (Exception ex) { return Error(ex.Message); }
        }

        // ─── Buyer: My Vouchers ───────────────────────────────────────────────
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyVouchers()
        {
            try { return Success(await _voucherService.GetMyVouchersAsync(GetUserId())); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        // ─── Checkout Validate ────────────────────────────────────────────────
        [Authorize]
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateVoucher([FromBody] ValidateVoucherRequestDto request)
        {
            try { return Success(await _voucherService.ValidateVoucherAsync(request.MaCode, GetUserId(), request.TongTienDonHang, request.SanPhamDangIds)); }
            catch (Exception ex) { return Error(ex.Message); }
        }

        // ─── Homepage: discount lookup ────────────────────────────────────────
        [HttpPost("discounts")]
        public async Task<IActionResult> GetDiscounts([FromBody] List<Guid> sanPhamDangIds)
        {
            try { return Success(await _voucherService.GetActiveDiscountForProductsAsync(sanPhamDangIds)); }
            catch (Exception ex) { return Error(ex.Message); }
        }
    }

    public class ValidateVoucherRequestDto
    {
        public string MaCode { get; set; } = string.Empty;
        public decimal TongTienDonHang { get; set; }
        public List<Guid> SanPhamDangIds { get; set; } = new();
    }
}
