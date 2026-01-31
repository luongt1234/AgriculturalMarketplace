using AgroMarket.Application.Wrappers; // Nhớ using namespace này
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        // 1. Trả về thành công với Data
        protected IActionResult Success<T>(T data, string message = "Thành công")
        {
            var response = new Response<T>(data, message);
            return Ok(response);
        }

        // 2. Trả về thành công không cần Data (VD: Delete, Update)
        protected IActionResult Success(string message = "Thành công")
        {
            // Truyền null vào Data, và ép kiểu để trình biên dịch hiểu
            var response = new Response<object>(null, message);
            return Ok(response);
        }

        // 3. Trả về Created (201)
        protected IActionResult CreatedResult<T>(T data, string message = "Tạo mới thành công")
        {
            var response = new Response<T>(data, message);
            return StatusCode(201, response);
        }

        // 4. Trả về lỗi
        protected IActionResult Error(string message, int statusCode = 400, List<string>? errors = null)
        {
            var response = new Response<object>(message)
            {
                Success = false,
                Errors = errors
            };
            return StatusCode(statusCode, response);
        }

        // 5. Trả về Phân trang (Mới thêm)
        protected IActionResult PagedResult<T>(T data, int pageNumber, int pageSize, int totalRecords)
        {
            var response = new PagedResponse<T>(data, pageNumber, pageSize, totalRecords);
            return Ok(response);
        }
    }
}