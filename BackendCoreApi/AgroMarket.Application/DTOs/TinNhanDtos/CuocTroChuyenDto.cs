namespace AgroMarket.Application.DTOs.TinNhanDtos
{
    public class CuocTroChuyenDto
    {
        /// <summary>
        /// ID người dùng còn lại trong cuộc hội thoại (người kia)
        /// </summary>
        public Guid OtherUserId { get; set; }
        public string OtherUserName { get; set; } = null!;
        public string? OtherUserAvatar { get; set; }

        /// <summary>
        /// Nội dung tin nhắn cuối cùng
        /// </summary>
        public string LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageTime { get; set; }

        /// <summary>
        /// Số tin chưa đọc (gửi đến user hiện tại)
        /// </summary>
        public int UnreadCount { get; set; }

        /// <summary>
        /// Tin nhắn cuối là của chính mình gửi hay không
        /// </summary>
        public bool IsLastMessageMine { get; set; }
    }
}
