using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface IFileStorageService
    {
        /// <summary>
        /// Lưu file vào wwwroot và trả về đường dẫn tương đối.
        /// </summary>
        /// <param name="file">File từ IFormFile</param>
        /// <param name="subFolder">Thư mục con bên trong wwwroot/uploads (ví dụ: "products")</param>
        /// <returns>Đường dẫn web tương đối (ví dụ: /uploads/products/ten_file.jpg)</returns>
        Task<string> SaveFileAsync(IFormFile file, string subFolder);

        /// <summary>
        /// Xóa file dựa trên đường dẫn tương đối.
        /// </summary>
        /// <param name="relativePath">Đường dẫn web tương đối (ví dụ: /uploads/products/ten_file.jpg)</param>
        void DeleteFile(string? relativePath);
    }
}
