using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace AgroMarket.Api.Hubs
{
    /// <summary>
    /// Hub thông báo đơn hàng real-time.
    /// Khi buyer đặt đơn → backend push "NewOrder" lên group của seller.
    /// Khi seller xác nhận / từ chối → backend push "OrderStatusChanged" lên group của buyer.
    /// </summary>
    [Authorize]
    public class OrderHub : Hub
    {
        private readonly ILogger<OrderHub> _logger;

        public OrderHub(ILogger<OrderHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId != Guid.Empty)
            {
                // Mỗi user join group cá nhân: "order_user_{id}"
                await Groups.AddToGroupAsync(Context.ConnectionId, $"order_user_{userId}");
                _logger.LogInformation("User {UserId} connected to OrderHub", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (userId != Guid.Empty)
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"order_user_{userId}");
            await base.OnDisconnectedAsync(exception);
        }

        // ── Helpers ─────────────────────────────────────────────────────────────
        private Guid GetUserId()
        {
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }

        /// <summary>
        /// Trả về tên group để push tới 1 user cụ thể.
        /// Dùng từ controller: _hubContext.Clients.Group(OrderHub.UserGroup(id))
        /// </summary>
        public static string UserGroup(Guid userId) => $"order_user_{userId}";
    }
}
