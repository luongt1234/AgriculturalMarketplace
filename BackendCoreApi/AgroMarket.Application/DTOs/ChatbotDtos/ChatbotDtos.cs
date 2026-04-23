namespace AgroMarket.Application.DTOs.ChatbotDtos
{
    public class ChatbotMessageDto
    {
        /// <summary>
        /// "user" hoặc "model"
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Nội dung tin nhắn
        /// </summary>
        public string Content { get; set; } = string.Empty;
    }

    public class ChatbotRequestDto
    {
        /// <summary>
        /// Tin nhắn hiện tại của người dùng
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Lịch sử hội thoại trước đó (để Gemini nhớ ngữ cảnh)
        /// </summary>
        public List<ChatbotMessageDto>? History { get; set; }
    }

    public class ChatbotResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public bool Success { get; set; } = true;
        public string? Error { get; set; }
    }
}
