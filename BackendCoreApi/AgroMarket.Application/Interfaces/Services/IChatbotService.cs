using AgroMarket.Application.DTOs.ChatbotDtos;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface IChatbotService
    {
        /// <summary>
        /// Gửi tin nhắn đến Gemini AI và nhận phản hồi
        /// </summary>
        /// <param name="message">Tin nhắn của người dùng</param>
        /// <param name="history">Lịch sử hội thoại để Gemini nhớ ngữ cảnh</param>
        /// <returns>Nội dung phản hồi từ AI</returns>
        Task<string> ChatAsync(string message, List<ChatbotMessageDto>? history = null);
    }
}
