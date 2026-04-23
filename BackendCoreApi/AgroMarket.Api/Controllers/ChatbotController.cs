using AgroMarket.Application.DTOs.ChatbotDtos;
using AgroMarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    /// <summary>
    /// Controller xử lý chatbot AI (Gemini) cho người mua
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;
        private readonly ILogger<ChatbotController> _logger;

        public ChatbotController(IChatbotService chatbotService, ILogger<ChatbotController> logger)
        {
            _chatbotService = chatbotService;
            _logger = logger;
        }

        /// <summary>
        /// Gửi tin nhắn đến AI chatbot và nhận phản hồi
        /// POST /api/chatbot/chat
        /// Không yêu cầu đăng nhập để người dùng chưa đăng ký cũng có thể dùng thử
        /// </summary>
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatbotRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new ChatbotResponseDto
                {
                    Success = false,
                    Error = "Tin nhắn không được để trống."
                });

            if (request.Message.Length > 2000)
                return BadRequest(new ChatbotResponseDto
                {
                    Success = false,
                    Error = "Tin nhắn quá dài (tối đa 2000 ký tự)."
                });

            _logger.LogInformation("Chatbot request: {Message}", request.Message[..Math.Min(50, request.Message.Length)]);

            var reply = await _chatbotService.ChatAsync(request.Message, request.History);

            return Ok(new ChatbotResponseDto
            {
                Reply = reply,
                Success = true
            });
        }
    }
}
