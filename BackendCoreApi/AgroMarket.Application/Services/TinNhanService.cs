using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.TinNhanDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Application.Services
{
    public class TinNhanService : ITinNhanService
    {
        private readonly IRepository<TinNhan> _tinNhanRepository;
        private readonly IRepository<NguoiDung> _nguoiDungRepository;
        private readonly IUnitOfWork _unitOfWork;

        public TinNhanService(
            IRepository<TinNhan> tinNhanRepository,
            IRepository<NguoiDung> nguoiDungRepository,
            IUnitOfWork unitOfWork)
        {
            _tinNhanRepository = tinNhanRepository;
            _nguoiDungRepository = nguoiDungRepository;
            _unitOfWork = unitOfWork;
        }

        // ─── Danh sách cuộc hội thoại ───────────────────────────────────────────
        public async Task<List<CuocTroChuyenDto>> GetCuocTroChuyenAsync(Guid userId)
        {
            try
            {
                // Lấy tất cả tin nhắn liên quan đến userId
                var allMessages = await _tinNhanRepository
                    .GetAll()
                    .Where(m => m.NguoiGuiId == userId || m.NguoiNhanId == userId)
                    .Include(m => m.NguoiGui)
                    .Include(m => m.NguoiNhan)
                    .OrderByDescending(m => m.ThoiGian)
                    .ToListAsync();

                // Group theo người kia trong cuộc trò chuyện
                var grouped = allMessages
                    .GroupBy(m => m.NguoiGuiId == userId ? m.NguoiNhanId : m.NguoiGuiId)
                    .Select(g =>
                    {
                        var lastMsg = g.First(); // đã sort desc → first = latest
                        var otherUser = lastMsg.NguoiGuiId == userId
                            ? lastMsg.NguoiNhan
                            : lastMsg.NguoiGui;
                        var unread = g.Count(m => m.NguoiNhanId == userId && m.TrangThai == TrangThaiTinNhan.ChuaDoc);

                        return new CuocTroChuyenDto
                        {
                            OtherUserId = g.Key,
                            OtherUserName = otherUser?.HoTen ?? "Người dùng",
                            OtherUserAvatar = otherUser?.AnhDaiDienUrl,
                            LastMessage = lastMsg.NoiDung,
                            LastMessageTime = lastMsg.ThoiGian,
                            UnreadCount = unread,
                            IsLastMessageMine = lastMsg.NguoiGuiId == userId
                        };
                    })
                    .OrderByDescending(c => c.LastMessageTime)
                    .ToList();

                return grouped;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy danh sách hội thoại: {ex.Message}");
            }
        }

        // ─── Lịch sử tin nhắn ───────────────────────────────────────────────────
        public async Task<List<TinNhanDto>> GetLichSuTinNhanAsync(Guid userId, Guid otherUserId, int page = 1, int pageSize = 30)
        {
            try
            {
                var messages = await _tinNhanRepository
                    .GetAll()
                    .Where(m =>
                        (m.NguoiGuiId == userId && m.NguoiNhanId == otherUserId) ||
                        (m.NguoiGuiId == otherUserId && m.NguoiNhanId == userId))
                    .Include(m => m.NguoiGui)
                    .OrderByDescending(m => m.ThoiGian)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Trả về theo thứ tự cũ → mới để hiển thị đúng chiều
                return messages
                    .OrderBy(m => m.ThoiGian)
                    .Select(m => MapToDto(m))
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy lịch sử tin nhắn: {ex.Message}");
            }
        }

        // ─── Gửi tin nhắn ───────────────────────────────────────────────────────
        public async Task<TinNhanDto> GuiTinNhanAsync(GuiTinNhanDto request, Guid senderId)
        {
            try
            {
                var tinNhan = new TinNhan
                {
                    Id = Guid.NewGuid(),
                    NguoiGuiId = senderId,
                    NguoiNhanId = request.NguoiNhanId,
                    NoiDung = request.NoiDung.Trim(),
                    ThoiGian = DateTime.UtcNow,
                    TrangThai = TrangThaiTinNhan.ChuaDoc,
                    NgayTao = DateTime.UtcNow
                };

                _tinNhanRepository.Add(tinNhan);
                await _unitOfWork.CommitAsync();

                // Load thông tin người gửi để trả về DTO đầy đủ
                var nguoiGui = await _nguoiDungRepository.GetByIdAsync(senderId);
                tinNhan.NguoiGui = nguoiGui!;

                return MapToDto(tinNhan);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi gửi tin nhắn: {ex.Message}");
            }
        }

        // ─── Đánh dấu đã đọc ────────────────────────────────────────────────────
        public async Task DanhDauDaDocAsync(Guid userId, Guid otherUserId)
        {
            try
            {
                var unreadMessages = await _tinNhanRepository
                    .GetAll()
                    .Where(m => m.NguoiGuiId == otherUserId && m.NguoiNhanId == userId && m.TrangThai == TrangThaiTinNhan.ChuaDoc)
                    .ToListAsync();

                foreach (var msg in unreadMessages)
                {
                    msg.TrangThai = TrangThaiTinNhan.DaDoc;
                    _tinNhanRepository.Update(msg);
                }

                if (unreadMessages.Any())
                    await _unitOfWork.CommitAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi đánh dấu đã đọc: {ex.Message}");
            }
        }

        // ─── Đếm tin chưa đọc ───────────────────────────────────────────────────
        public async Task<int> DemTinChuaDocAsync(Guid userId)
        {
            try
            {
                return await _tinNhanRepository
                    .GetAll()
                    .CountAsync(m => m.NguoiNhanId == userId && m.TrangThai == TrangThaiTinNhan.ChuaDoc);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi đếm tin chưa đọc: {ex.Message}");
            }
        }

        // ─── Helper ─────────────────────────────────────────────────────────────
        private static TinNhanDto MapToDto(TinNhan m) => new()
        {
            Id = m.Id,
            NguoiGuiId = m.NguoiGuiId,
            NguoiNhanId = m.NguoiNhanId,
            NoiDung = m.NoiDung,
            ThoiGian = m.ThoiGian,
            TrangThai = m.TrangThai.ToString(),
            TenNguoiGui = m.NguoiGui?.HoTen,
            AnhDaiDienNguoiGui = m.NguoiGui?.AnhDaiDienUrl
        };
    }
}
