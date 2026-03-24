using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Application.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Services
{
    public interface INguoiDungService
    {
        public Task<PagedResponse<IEnumerable<NguoiDungDto>>> GetAllByMaAsync(int pageSize, int pageNumber, string ma);
    }
}
