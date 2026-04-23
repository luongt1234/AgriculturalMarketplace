using AgroMarket.Application.DTOs.ChatbotDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Application.Interfaces.Repositories; // Thêm dòng này
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace AgroMarket.Application.Services
{
    public class ChatbotService : IChatbotService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;
        private readonly string _model;
        private readonly string _systemPrompt;
        private readonly ILogger<ChatbotService> _logger;

        // 1. Inject Repository để lấy dữ liệu từ DB (Chuẩn Clean Architecture)
        private readonly ISanPhamDangRepository _sanPhamDangRepo;

        public ChatbotService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<ChatbotService> logger,
            ISanPhamDangRepository sanPhamDangRepo)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _sanPhamDangRepo = sanPhamDangRepo;

            var geminiSection = configuration.GetSection("GeminiSettings");
            _apiKey = geminiSection["ApiKey"] ?? throw new InvalidOperationException("GeminiSettings:ApiKey chưa được cấu hình trong appsettings.json");
            _model = geminiSection["Model"] ?? "gemini-1.5-flash";
            _systemPrompt = geminiSection["SystemPrompt"] ?? "Bạn là trợ lý AI hỗ trợ mua sắm nông sản.";
        }

        public async Task<string> ChatAsync(string message, List<ChatbotMessageDto>? history = null)
        {
            try
            {
                var activeProducts = await _sanPhamDangRepo.GetTopActiveProductsAsync(10);

                var promptData = activeProducts.Select(p => new {
                    TenSP = p.TenHienThi,
                    Gia = p.Gia,
                    SoLuongCon = p.SoLuong,
                    MoTa = p.MoTaChiTiet
                });

                string dbContextStr = JsonSerializer.Serialize(promptData, new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                });

                string enrichedSystemPrompt = $"{_systemPrompt}\n\n" +
                    $"DỮ LIỆU HỆ THỐNG THỰC TẾ HIỆN TẠI (Dùng thông tin này để trả lời khách):\n" +
                    $"{dbContextStr}\n\n" +
                    $"Lưu ý: Nếu khách hỏi sản phẩm không có trong danh sách trên, hãy báo là hiện tại hệ thống chưa có hoặc đã hết hàng.";

                var client = new Client(apiKey: _apiKey);
                var contents = new List<Content>();

                contents.Add(new Content
                {
                    Role = "system",
                    Parts = new List<Part>
                    {
                        new Part { Text = enrichedSystemPrompt }
                    }
                });

                if (history != null && history.Count > 0)
                {
                    foreach (var msg in history)
                    {
                        contents.Add(new Content
                        {
                            Role = msg.Role,
                            Parts = new List<Part> { new Part { Text = msg.Content } }
                        });
                    }
                }

                contents.Add(new Content
                {
                    Role = "user",
                    Parts = new List<Part> { new Part { Text = message } }
                });
                var response = await client.Models.GenerateContentAsync(
                    model: _model,
                    contents: contents
                );

                var text = response?.Candidates?
                    .FirstOrDefault()?
                    .Content?
                    .Parts?
                    .FirstOrDefault()?
                    .Text;

                return text ?? "Xin lỗi, tôi không thể xử lý yêu cầu này.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gọi Gemini API");
                return "Xin lỗi, đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
            }
        }
    }
}