using AgroMarket.Application.DTOs.DonHangDtos;
using AgroMarket.Application.Interfaces.Repositories;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Wrappers;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;

namespace AgroMarket.Application.Services
{
    public class DonHangService : IDonHangService
    {
        private readonly IDonHangRepository _donHangRepository;
        private readonly IGioHangRepository _gioHangRepository;

        public DonHangService(IDonHangRepository donHangRepository, IGioHangRepository gioHangRepository)
        {
            _donHangRepository = donHangRepository;
            _gioHangRepository = gioHangRepository;
        }

        // ── Buyer: lấy đơn của mình ─────────────────────────────────────────────
        public async Task<PagedResponse<IEnumerable<DonHangDto>>> GetMyOrdersAsync(
            Guid nguoiMuaId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null)
        {
            var (items, total) = await _donHangRepository.GetByNguoiMuaPagedAsync(
                nguoiMuaId, pageNumber, pageSize, trangThai);

            return new PagedResponse<IEnumerable<DonHangDto>>(items, pageNumber, pageSize, total);
        }

        // ── Tạo đơn hàng COD ────────────────────────────────────────────────────
        public async Task<TaoDonHangResponse> TaoDonHangAsync(Guid nguoiMuaId, TaoDonHangRequest request)
        {
            if (request.Items == null || !request.Items.Any())
                throw new InvalidOperationException("Đơn hàng phải có ít nhất 1 sản phẩm.");

            // Tính tổng tiền hàng
            decimal tongTien = request.Items.Sum(i => i.SoLuong * i.DonGia);

            // Lấy NguoiBanId từ item đầu tiên – đơn hàng luôn thuộc 1 seller
            // (FE đã nhóm trước khi gửi)
            Guid nguoiBanId = request.Items.First().SanPhamDangId; // placeholder, real value set below

            // Build entity
            var donHang = new DonHang
            {
                NguoiMuaId        = nguoiMuaId,
                NguoiBanId        = request.NguoiBanId,           // FE gửi kèm
                TongTien          = tongTien,
                PhiVanChuyen      = request.PhiVanChuyen,
                DiaChiGiaoHang    = request.DiaChiGiaoHang,
                GhiChu            = request.GhiChu,
                TrangThai         = TrangThaiDonHang.ChoXuLy,
                PhuongThucNhanHang = PhuongThucGiaoHang.GiaoHang,
            };

            var chiTietList = request.Items.Select(i => new ChiTietDonHang
            {
                SanPhamDangId = i.SanPhamDangId,
                SoLuong       = i.SoLuong,
                DonGia        = i.DonGia
            }).ToList();

            var created = await _donHangRepository.TaoDonHangAsync(donHang, chiTietList);

            // Xoá các item đã đặt khỏi giỏ hàng
            try
            {
                var orderedIds = request.Items.Select(i => i.SanPhamDangId).ToHashSet();
                await _gioHangRepository.RemoveItemsByProductIdsAsync(nguoiMuaId, orderedIds);
            }
            catch
            {
                // Không fail toàn bộ nếu xoá giỏ hàng thất bại
            }

            return new TaoDonHangResponse
            {
                DonHangId      = created.Id,
                TrangThai      = created.TrangThai.ToString(),
                TongTien       = created.TongTien,
                PhiVanChuyen   = created.PhiVanChuyen,
                TongThanhToan  = created.TongThanhToan,
                NgayTao        = created.NgayTao
            };
        }

        // ── Seller: lấy đơn của shop mình ───────────────────────────────────────
        public async Task<PagedResponse<IEnumerable<DonHangDto>>> GetSellerOrdersAsync(
            Guid nguoiBanId, int pageNumber, int pageSize, TrangThaiDonHang? trangThai = null)
        {
            var (items, total) = await _donHangRepository.GetByNguoiBanPagedAsync(
                nguoiBanId, pageNumber, pageSize, trangThai);

            return new PagedResponse<IEnumerable<DonHangDto>>(items, pageNumber, pageSize, total);
        }

        // ── Seller: xác nhận đơn ────────────────────────────────────────────────
        public async Task<bool> SellerXacNhanAsync(Guid donHangId, Guid nguoiBanId)
        {
            var dh = await _donHangRepository.GetByIdWithDetailsAsync(donHangId)
                ?? throw new KeyNotFoundException("Không tìm thấy đơn hàng.");

            if (dh.NguoiBanId != nguoiBanId)
                throw new UnauthorizedAccessException("Bạn không có quyền xử lý đơn hàng này.");

            if (dh.TrangThai != TrangThaiDonHang.ChoXuLy)
                throw new InvalidOperationException("Chỉ có thể xác nhận đơn đang ở trạng thái Chờ xử lý.");

            return await _donHangRepository.CapNhatTrangThaiAsync(donHangId, TrangThaiDonHang.XacNhan, nguoiBanId);
        }

        // ── Seller: từ chối đơn ─────────────────────────────────────────────────
        public async Task<bool> SellerTuChoiAsync(Guid donHangId, Guid nguoiBanId)
        {
            var dh = await _donHangRepository.GetByIdWithDetailsAsync(donHangId)
                ?? throw new KeyNotFoundException("Không tìm thấy đơn hàng.");

            if (dh.NguoiBanId != nguoiBanId)
                throw new UnauthorizedAccessException("Bạn không có quyền xử lý đơn hàng này.");

            if (dh.TrangThai != TrangThaiDonHang.ChoXuLy)
                throw new InvalidOperationException("Chỉ có thể từ chối đơn đang ở trạng thái Chờ xử lý.");

            return await _donHangRepository.CapNhatTrangThaiAsync(donHangId, TrangThaiDonHang.Huy, nguoiBanId);
        }

        // ── Seller: chuyển sang giao hàng ───────────────────────────────────────
        public async Task<bool> SellerGiaoHangAsync(Guid donHangId, Guid nguoiBanId)
        {
            var dh = await _donHangRepository.GetByIdWithDetailsAsync(donHangId)
                ?? throw new KeyNotFoundException("Không tìm thấy đơn hàng.");

            if (dh.NguoiBanId != nguoiBanId)
                throw new UnauthorizedAccessException("Bạn không có quyền xử lý đơn hàng này.");

            if (dh.TrangThai != TrangThaiDonHang.XacNhan)
                throw new InvalidOperationException("Chỉ có thể giao hàng khi đơn đã được xác nhận.");

            return await _donHangRepository.CapNhatTrangThaiAsync(donHangId, TrangThaiDonHang.DangGiao, nguoiBanId);
        }

        // ── Buyer: xác nhận đã nhận hàng ────────────────────────────────────────
        public async Task<bool> BuyerXacNhanDaNhanAsync(Guid donHangId, Guid nguoiMuaId)
        {
            var dh = await _donHangRepository.GetByIdWithDetailsAsync(donHangId)
                ?? throw new KeyNotFoundException("Không tìm thấy đơn hàng.");

            if (dh.NguoiMuaId != nguoiMuaId)
                throw new UnauthorizedAccessException("Bạn không có quyền thực hiện thao tác này.");

            if (dh.TrangThai != TrangThaiDonHang.DaGiao && dh.TrangThai != TrangThaiDonHang.DangGiao)
                throw new InvalidOperationException("Đơn hàng chưa được giao.");

            return await _donHangRepository.CapNhatTrangThaiAsync(donHangId, TrangThaiDonHang.HoanTat, nguoiMuaId);
        }
    }
}
