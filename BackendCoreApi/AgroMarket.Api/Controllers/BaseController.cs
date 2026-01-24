using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        // 1. Trả về thành công (200 OK) với dữ liệu
        protected IActionResult Success<T>(T data, string message = "Thành công")
        {
            return Ok(new
            {
                Success = true,
                Message = message,
                Data = data
            });
        }

        // 2. Trả về khi tạo mới thành công (201 Created)
        protected IActionResult CreatedResult<T>(T data, string message = "Tạo mới thành công")
        {
            return StatusCode(201, new
            {
                Success = true,
                Message = message,
                Data = data
            });
        }

        // 3. Trả về lỗi (400 Bad Request hoặc tùy chỉnh)
        // Lưu ý: Exception nên để Middleware bắt, hàm này dùng cho validate logic
        protected IActionResult Error(string message, int statusCode = 400)
        {
            return StatusCode(statusCode, new
            {
                Success = false,
                Message = message
            });
        }
        protected IActionResult Success(string message = "Thành công")
        {
            return Ok(new
            {
                Success = true,
                Message = message,
                Data = (object)null // Ép kiểu null về object để JSON không bị lỗi
            });
        }
    }
}