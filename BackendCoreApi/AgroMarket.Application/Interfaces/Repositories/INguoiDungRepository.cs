using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AgroMarket.Domain.Entities;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface INguoiDungRepository
    {
        /// <summary>
        /// Lấy danh sách người dùng theo phân trang.
        /// Lưu ý: tên tham số giữ nguyên theo yêu cầu (pageIndex, pageNumber).
        /// pageIndex được sử dụng như pageSize, pageNumber là chỉ số trang (1-based).
        /// Trả về tuple gồm dữ liệu và tổng số bản ghi.
        /// </summary>
        Task<(IEnumerable<NguoiDung> Data, int TotalRecords)> GetAllPagedAsync(int pageIndex, int pageNumber);

        /// <summary>
        /// Lấy danh sách người bán theo phân trang.
        /// Lưu ý: tên tham số giữ nguyên theo yêu cầu (pageIndex, pageNumber).
        /// pageIndex được sử dụng như pageSize, pageNumber là chỉ số trang (1-based).
        /// Trả về tuple gồm dữ liệu và tổng số bản ghi.
        /// </summary>
        Task<(IEnumerable<NguoiDung> Data, int TotalRecords)> GetAllBuyerPagedAsync(int pageIndex, int pageNumber, Guid vaiTroId);

    }
}
