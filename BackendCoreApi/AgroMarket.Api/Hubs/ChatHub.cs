using AgroMarket.Application.DTOs.TinNhanDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace AgroMarket.Api.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ITinNhanService _tinNhanService;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ITinNhanService tinNhanService, ILogger<ChatHub> logger)
        {
            _tinNhanService = tinNhanService;
            _logger = logger;
        }

        // ─── Kết nối: tự động join vào group cá nhân (để nhận tin realtime) ───
        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId != Guid.Empty)
            {
                // Join group cá nhân để nhận thông báo tin mới từ bất kỳ ai
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
                _logger.LogInformation("User {UserId} connected to ChatHub", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (userId != Guid.Empty)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
                _logger.LogInformation("User {UserId} disconnected from ChatHub", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        // ─── Join vào conversation group (để nhận tin của 1 cuộc trò chuyện) ──
        public async Task JoinConversation(string otherUserId)
        {
            var userId = GetUserId();
            var groupName = GetConversationGroup(userId, Guid.Parse(otherUserId));
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Đánh dấu đã đọc khi mở hội thoại
            await _tinNhanService.DanhDauDaDocAsync(userId, Guid.Parse(otherUserId));

            // Thông báo cho bên kia biết tin đã được đọc
            await Clients.Group($"user_{otherUserId}")
                .SendAsync("MessagesRead", userId.ToString());
        }

        public async Task LeaveConversation(string otherUserId)
        {
            var userId = GetUserId();
            var groupName = GetConversationGroup(userId, Guid.Parse(otherUserId));
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        // ─── Gửi tin nhắn realtime ───────────────────────────────────────────
        public async Task SendMessage(GuiTinNhanDto request)
        {
            var senderId = GetUserId();
            if (senderId == Guid.Empty) return;

            // Lưu DB
            var tinNhanDto = await _tinNhanService.GuiTinNhanAsync(request, senderId);

            var groupName = GetConversationGroup(senderId, request.NguoiNhanId);

            // Broadcast đến conversation group (cả 2 user nếu đang mở)
            await Clients.Group(groupName).SendAsync("ReceiveMessage", tinNhanDto);

            // Broadcast đến group cá nhân của người nhận (để update badge/danh sách)
            await Clients.Group($"user_{request.NguoiNhanId}")
                .SendAsync("NewMessageNotification", tinNhanDto);
        }

        // ─── Helper ─────────────────────────────────────────────────────────
        private Guid GetUserId()
        {
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }

        /// <summary>
        /// Group name chuẩn hóa để 2 user A-B và B-A cùng vào 1 group
        /// </summary>
        private static string GetConversationGroup(Guid userId1, Guid userId2)
        {
            var ids = new[] { userId1, userId2 }.OrderBy(x => x).ToArray();
            return $"conv_{ids[0]}_{ids[1]}";
        }
    }
}
