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
        private readonly IGHNService _ghnService;

        public DonHangService(IDonHangRepository donHangRepository, IGioHangRepository gioHangRepository, IGHNService ghnService)
        {
            _donHangRepository = donHangRepository;
            _gioHangRepository = gioHangRepository;
            _ghnService = ghnService;
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
            // 1. Lấy đơn hàng từ Database
            var dh = await _donHangRepository.GetByIdWithDetailsAsync(donHangId)
                ?? throw new KeyNotFoundException("Không tìm thấy đơn hàng.");

            if (dh.NguoiBanId != nguoiBanId)
                throw new UnauthorizedAccessException("Bạn không có quyền xử lý đơn hàng này.");

            if (dh.TrangThai != TrangThaiDonHang.ChoXuLy)
                throw new InvalidOperationException("Chỉ có thể xác nhận đơn đang ở trạng thái Chờ xử lý.");

            
            dh.TrangThai = TrangThaiDonHang.XacNhan;
            dh.NgayChinhSua = DateTime.UtcNow;

            await _donHangRepository.UpdateAsync(dh);

            return true;
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

            int totalWeight = dh.ChiTietDonHang.Sum(ct => ct.SoLuong * 1000);

            if (totalWeight > 50000)
            {
                throw new InvalidOperationException("Khối lượng đơn hàng vượt quá 50kg, vui lòng tách đơn hoặc tự vận chuyển.");
            }

            int autoServiceTypeId = totalWeight <= 20000 ? 2 : 5;

            // ── Địa chỉ người nhận (Buyer) ──────────────────────────────────────
            string toWardCode = "";
            int toDistrictId = 0;
            string toAddress = "Địa chỉ khách hàng";

            if (!string.IsNullOrEmpty(dh.DiaChiGiaoHang))
            {
                try
                {
                    using var toDoc = System.Text.Json.JsonDocument.Parse(dh.DiaChiGiaoHang);
                    var toRoot = toDoc.RootElement;

                    if (toRoot.TryGetProperty("wardCode", out var wc))
                        toWardCode = wc.GetString() ?? toWardCode;

                    if (toRoot.TryGetProperty("districtId", out var di) && di.TryGetInt32(out var dId))
                        toDistrictId = dId;

                    if (toRoot.TryGetProperty("diaChiChiTiet", out var dcct) &&
                        toRoot.TryGetProperty("wardName", out var wn) &&
                        toRoot.TryGetProperty("districtName", out var dn) &&
                        toRoot.TryGetProperty("provinceName", out var pn))
                    {
                        toAddress = $"{dcct.GetString()}, {wn.GetString()}, {dn.GetString()}, {pn.GetString()}";
                    }
                }
                catch (System.Text.Json.JsonException) { }
            }

            // ── Địa chỉ người gửi (Seller) — lấy từ DiaChi sản phẩm đầu tiên ──
            string fromWardCode = "";
            int fromDistrictId = 0;
            string fromAddress = dh.NguoiBan.DiaChi ?? "Địa chỉ nông trại";

            var firstProduct = dh.ChiTietDonHang.FirstOrDefault()?.SanPhamDang;
            if (firstProduct != null && !string.IsNullOrEmpty(firstProduct.DiaChi))
            {
                try
                {
                    using var fromDoc = System.Text.Json.JsonDocument.Parse(firstProduct.DiaChi);
                    var fromRoot = fromDoc.RootElement;

                    // Format: { provinceId, provinceName, districtId, districtName, wardCode, wardName, diaChiChiTiet? }
                    if (fromRoot.TryGetProperty("wardCode", out var fwc))
                        fromWardCode = fwc.GetString() ?? fromWardCode;

                    if (fromRoot.TryGetProperty("districtId", out var fdi) && fdi.TryGetInt32(out var fdId))
                        fromDistrictId = fdId;

                    var parts = new List<string>();
                    if (fromRoot.TryGetProperty("diaChiChiTiet", out var fDcct) && !string.IsNullOrEmpty(fDcct.GetString()))
                        parts.Add(fDcct.GetString()!);
                    if (fromRoot.TryGetProperty("wardName", out var fwn) && !string.IsNullOrEmpty(fwn.GetString()))
                        parts.Add(fwn.GetString()!);
                    if (fromRoot.TryGetProperty("districtName", out var fdn) && !string.IsNullOrEmpty(fdn.GetString()))
                        parts.Add(fdn.GetString()!);
                    if (fromRoot.TryGetProperty("provinceName", out var fpn) && !string.IsNullOrEmpty(fpn.GetString()))
                        parts.Add(fpn.GetString()!);
                    if (parts.Count > 0)
                        fromAddress = string.Join(", ", parts);
                }
                catch (System.Text.Json.JsonException) { }
            }

            // Fallback nếu vẫn chưa có đủ thông tin GHN
            if (string.IsNullOrEmpty(fromWardCode) || fromDistrictId == 0)
                throw new InvalidOperationException("Không thể lấy địa chỉ lấy hàng của người bán. Vui lòng cập nhật địa chỉ trên sản phẩm.");

            if (string.IsNullOrEmpty(toWardCode) || toDistrictId == 0)
                throw new InvalidOperationException("Không thể lấy địa chỉ giao hàng của người mua. Vui lòng kiểm tra lại đơn hàng.");

            var orderPayload = new
            {
                payment_type_id = 2,
                note = dh.GhiChu ?? "Hàng nông sản dễ dập nát, xin nhẹ tay",
                required_note = "CHOXEMHANGKHONGTHU",
                return_phone = dh.NguoiBan.SoDienThoai ?? "0987654321",
                return_address = dh.NguoiBan.DiaChi ?? "Địa chỉ nông trại",
                client_order_code = dh.Id.ToString(),

                from_name = dh.NguoiBan.HoTen,
                from_phone = dh.NguoiBan.SoDienThoai ?? "0987654321",
                from_address = fromAddress,
                from_ward_code = fromWardCode,
                from_district_id = fromDistrictId,

                to_name = dh.NguoiMua.HoTen,
                to_phone = dh.NguoiMua.SoDienThoai,
                to_address = toAddress,
                to_ward_code = toWardCode,
                to_district_id = toDistrictId,

                service_type_id = autoServiceTypeId,

                weight = totalWeight > 0 ? totalWeight : 1000,
                length = 20,
                width = 20,
                height = 20,

                items = dh.ChiTietDonHang.Select(ct => new
                {
                    name = ct.SanPhamDang?.TenHienThi ?? "Sản phẩm nông sản",
                    quantity = ct.SoLuong,
                    price = (int)ct.DonGia,
                    weight = 1000
                }).ToList()
            };

            var ghnResponse = await _ghnService.CreateShippingOrderAsync(orderPayload);

            if (!ghnResponse.IsSuccess)
            {
                throw new Exception($"Không thể đẩy đơn lên GHN: {ghnResponse.Message}");
            }

            dh.MaVanDonGhn = ghnResponse.TrackingCode;
            dh.TrangThai = TrangThaiDonHang.DangGiao;
            dh.NgayChinhSua = DateTime.UtcNow;

            return await _donHangRepository.UpdateAsync(dh);
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
